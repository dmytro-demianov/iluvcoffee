import {
    Inject,
    Injectable,
    NotFoundException,
    Scope,
} from '@nestjs/common';
import { Coffee } from "./entities/coffee.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Connection , Repository} from "typeorm";
import { CreateCoffeeDto } from "./dto/create-coffee.dto";
import { UpdateCoffeeDto } from "./dto/update-coffee.dto";
import { Flavor } from "./entities/flavor.entity";
import { PaginationQueryDto } from "../common/dto/pagination-query.dto";
import { Event } from "../events/entities/event.entity";
import { COFFEE_BRANDS } from "./coffee.constants";
import {
    ConfigService,
    ConfigType,
} from "@nestjs/config";
import coffeesConfig from './config/coffees.config';

// @Injectable()
@Injectable({ scope: Scope.DEFAULT })
// @Injectable({ scope: Scope.REQUEST })
// @Injectable({ scope: Scope.TRANSIENT })
export class CoffeesService {
    constructor(
        @InjectRepository(Coffee)
        private readonly coffeeRepository: Repository<Coffee>,
        @InjectRepository(Flavor)
        private readonly flavorRepository: Repository<Flavor>,
        private readonly connection: Connection,
        @Inject(COFFEE_BRANDS) coffeeBrands: string[],
        // private readonly configService: ConfigService,
        @Inject(coffeesConfig.KEY)
        private readonly coffeesConfiguration: ConfigType<typeof coffeesConfig>,
    ) {
        // console.info(coffeeBrands);
        // console.info('CoffeesService initialized!');

        // const databaseHost = this.configService.get<string>(
        //     // 'DATABASE_HOST',
        //     'database.host',
        //     'default_localhost'
        // );
        // console.info(databaseHost);

        // const coffeesConfig = this.configService.get('coffees.foo');
        // console.info(coffeesConfig);

        // console.info(coffeesConfiguration.foo);
    }

    findAll(paginationQuery: PaginationQueryDto) {
        let { limit, offset } = paginationQuery;

        return this.coffeeRepository.find({
            relations: ['flavors'],
            skip: offset,
            take: limit,
        });
    }

    async findOne(id: string) {

        // throw 'Send 500 error response';

        const coffee = await this.coffeeRepository.findOne(id, {
            relations: ['flavors'],
        });

        if (!coffee) {
            // throw new HttpException(`Coffee #[${id}] not found`, HttpStatus.NOT_FOUND);
            throw new NotFoundException(`Coffee #[${id}] not found`);
        }

        return coffee;
    }

    async create(createCoffeeDto: CreateCoffeeDto) {
        const flavors = await Promise.all(
            createCoffeeDto.flavors.map(name => this.preloadFlavorByName(name))
        );

        const coffee = this.coffeeRepository.create({
            ...createCoffeeDto,
            flavors,
        });
        return this.coffeeRepository.save(coffee);
    }

    async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
        const flavors = updateCoffeeDto.flavors
            && (await Promise.all(
                updateCoffeeDto.flavors.map(name => this.preloadFlavorByName( name))
            ))
        ;

        const coffee = await this.coffeeRepository.preload({
            id: +id,
            ...updateCoffeeDto,
            flavors
        });

        if (!coffee) {
            throw new NotFoundException(`Coffee not found by ID #[${id}]`);
        }

        return this.coffeeRepository.save(coffee);
    }

    async recommendCoffee(coffee: Coffee) {
        const queryRunner = this.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            coffee.recommendations++;

            const recommendCoffee = new Event();
            recommendCoffee.name = 'recommend_coffee';
            recommendCoffee.type = 'coffee';
            recommendCoffee.payload = { coffeeId: coffee.id };

            await queryRunner.manager.save(coffee);
            await queryRunner.manager.save(recommendCoffee);

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }

    async remove(id: string) {
        const coffee = await this.findOne(id);
        return this.coffeeRepository.remove(coffee);
    }

    private async preloadFlavorByName(name: string): Promise<Flavor> {
        const flavor = await this.flavorRepository.findOne({ name });

        if (flavor) {
            return flavor;
        }

        return this.flavorRepository.create({ name });
    }
}
