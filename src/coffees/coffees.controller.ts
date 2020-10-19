import {
    Body,
    Controller, Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param, Patch,
    Post, Query,
    Res,
} from '@nestjs/common';
import { CoffeesService } from "./coffees.service";
import {CreateCoffeeDto} from "./dto/create-coffee.dto";
import {UpdateCoffeeDto} from "./dto/update-coffee.dto";
import {PaginationQueryDto} from "../common/dto/pagination-query.dto";

@Controller('coffees')
export class CoffeesController {
    constructor(private readonly coffeeService: CoffeesService) {}

    @Get()
    // findAll(@Res() response) {
    findAll(@Query() paginationQuery: PaginationQueryDto) {
        // response.status(200).send('All coffees found');
        // return `Get all coffees with limit "${limit}" and offset "${offset}".`;

        return this.coffeeService.findAll(paginationQuery);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.coffeeService.findOne(id);
        // return `One coffee found with ID #[${id}]`;
    }

    @Post()
    // @HttpCode(HttpStatus.GONE)
    // create(@Body('name') body) {
    create(@Body() createCoffeeDto: CreateCoffeeDto) {
        // console.info(createCoffeeDto instanceof CreateCoffeeDto);
        return this.coffeeService.create(createCoffeeDto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCoffeeDto: UpdateCoffeeDto) {
        return this.coffeeService.update(id, updateCoffeeDto);
        // return `One coffee with ID #[${id}] was updated`;
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.coffeeService.remove(id);
        // return `One coffee with ID #[${id}] was deleted`;
    }
}
