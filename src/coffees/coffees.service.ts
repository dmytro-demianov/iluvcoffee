import {
    HttpException,
    HttpStatus,
    Injectable, NotFoundException,
} from '@nestjs/common';
import { Coffee } from "./entities/coffee.entity";

@Injectable()
export class CoffeesService {
    private coffees: Coffee[] = [
        {
            id: 1,
            name: 'Americano',
            brand: 'American Express',
            flavors: ['chocolate', 'vanilla'],
        },
    ];

    findAll() {
        return this.coffees;
    }

    findOne(id: string) {
        // throw 'Send 500 error response';
        const coffee = this.coffees.find(coffee => coffee.id === +id);
        if (!coffee) {
            // throw new HttpException(`Coffee #[${id}] not found`, HttpStatus.NOT_FOUND);
            throw new NotFoundException(`Coffee #[${id}] not found`);
        }
        return coffee;
    }

    create(createCoffeeDto: any) {
        this.coffees.push(createCoffeeDto);
        return createCoffeeDto;
    }

    update(id: string, updateCoffeeDto: any) {
        const coffee = this.findOne(id);
        if (coffee) {
            // todo: update coffee state
        }
    }

    remove(id: string) {
        const coffeeIndex = this.coffees.findIndex(coffee => coffee.id === +id);
        if (coffeeIndex >= 0) {
            this.coffees.splice(coffeeIndex, 1);
        }
    }
}
