import {
    Injectable,
    Module,
    Scope,
    UsePipes,
    // UseGuards,
    // UseFilters,
    // UseInterceptors,
    ValidationPipe,
} from '@nestjs/common';
import { CoffeesController } from "./coffees.controller";
import { CoffeesService } from "./coffees.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Coffee } from "./entities/coffee.entity";
import { Flavor } from "./entities/flavor.entity";
import { Event } from "../events/entities/event.entity";
import { COFFEE_BRANDS } from "./coffee.constants";
import { ConfigModule } from "@nestjs/config";
import coffeesConfig from './config/coffees.config';

// class MockCoffeeService {}
class ConfigService {}
class DevelopmentConfigService {}
class ProductionConfigService {}

// @UsePipes(ValidationPipe) // это предпочтительней
// @UsePipes(new ValidationPipe())
@Injectable()
class CoffeeBrandsFactory {
    create() {
        return ['buddy brew', 'nescafe'];
    }
}

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Coffee,
            Flavor,
            Event,
        ]),
        ConfigModule.forFeature(coffeesConfig),
    ],
    controllers: [CoffeesController],
    // providers: [
    //     CoffeesService,
    // ],
    providers: [
        CoffeesService,
        CoffeeBrandsFactory,

        // {
        //     provide: ConfigService,
        //     useClass: process.env.NODE_ENV === 'development'
        //         ? DevelopmentConfigService
        //         : ProductionConfigService
        // },

        // {
        //     provide: COFFEE_BRANDS,
        //     useValue: ['buddy brew', 'nescafe']
        // },

        {
            provide: COFFEE_BRANDS,
            useFactory: () => ['buddy brew', 'nescafe'],
            inject: [CoffeeBrandsFactory],
            scope: Scope.TRANSIENT,
        },

        // {
        //     provide: COFFEE_BRANDS,
        //     useFactory: (brandsFactory: CoffeeBrandsFactory) => brandsFactory.create(),
        //     inject: [CoffeeBrandsFactory],
        // },

        // {
        //     provide: COFFEE_BRANDS,
        //     useFactory: async (connection: Connection): Promise<string[]> => {
        //         // const coffeeBrands = await connection.query(`SELECT ...`);
        //         const coffeeBrands = await Promise.resolve(['buddy brew', 'nescafe']);
        //         console.info('[!] Async factory');
        //         return coffeeBrands;
        //     },
        //     inject: [Connection],
        // },
    ],
    // providers: [
    //     {
    //         provide: CoffeesService,
    //         useValue: new MockCoffeeService(),
    //     }
    // ],
    exports: [CoffeesService],
})
export class CoffeesModule {}
