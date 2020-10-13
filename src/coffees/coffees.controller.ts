import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    Param,
    Patch,
    Post,
    Query,
    Request,
    Res,
    SetMetadata,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { CoffeesService } from "./coffees.service";
import {CreateCoffeeDto} from "./dto/create-coffee.dto";
import {UpdateCoffeeDto} from "./dto/update-coffee.dto";
import {PaginationQueryDto} from "../common/dto/pagination-query.dto";
import {REQUEST} from "@nestjs/core";
import {Public} from "../common/decorators/public.decorator";
import {ParseIntPipe} from "../common/pipes/parse-int.pipe";
import {Protocol} from "../common/decorators/protocol.decorator";
import {ApiForbiddenResponse, ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags('coffees')
@Controller('coffees')
export class CoffeesController {
    constructor(
        private readonly coffeeService: CoffeesService,
        @Inject(REQUEST) private readonly request: Request
    ) {
        // console.log('CoffeesController created!');
    }

    // @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    @Get()
    // @SetMetadata('isPublic', true)
    @Public()
    // findAll(@Res() response) {
    async findAll(
        @Protocol('https') protocol: string,
        @Query() paginationQuery: PaginationQueryDto
    ) {
        console.log('Protocol: ', protocol);

        // response.status(200).send('All coffees found');
        // return `Get all coffees with limit "${limit}" and offset "${offset}".`;

        // await new Promise(resolve => setTimeout(resolve, 5000));

        return this.coffeeService.findAll(paginationQuery);
    }

    // @UsePipes(ValidationPipe)
    @Get(':id')
    // findOne(@Param('id') id: number) {
    findOne(@Param('id', ParseIntPipe) id: number) {
        // console.log('ID:', id);

        return this.coffeeService.findOne('' + id);
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
    // update(@Param('id') id: string, @Body(ValidationPipe) updateCoffeeDto: UpdateCoffeeDto) {
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
