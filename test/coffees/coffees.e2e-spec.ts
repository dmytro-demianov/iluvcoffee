import { Test, TestingModule } from '@nestjs/testing';
import {HttpStatus, INestApplication, ValidationPipe} from '@nestjs/common';
import {CoffeesModule} from "../../src/coffees/coffees.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import * as request from 'supertest';
import {CreateCoffeeDto} from "../../src/coffees/dto/create-coffee.dto";

describe('[Feature] Coffees /coffees', () => {
	const coffee = {
		name: 'Shiprweck Roast',
		brand: 'Buddy Brew',
		flavors: ['chocolate', 'vanilla'],
	};

	let app: INestApplication;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [
				CoffeesModule,
				TypeOrmModule.forRoot({
					type: 'postgres',
					host: 'localhost',
					port: 5433,
					username: 'postgres',
					password: 'pass123',
					database: 'postgres',
					autoLoadEntities: true,
					synchronize: true,
				}),
			],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(
			new ValidationPipe({
				whitelist: true,
				transform: true,
				forbidNonWhitelisted: true,
				transformOptions: {
					enableImplicitConversion: true,
				}
			})
		);

		await app.init();
	});

	it('Create [POST /]', () => {
		return request(app.getHttpServer())
			.post('/coffees')
			.send(coffee as CreateCoffeeDto)
			.expect(HttpStatus.CREATED)
			.then(({body}) => {
				const expectedCoffee = jasmine.objectContaining({
					...coffee,
					flavors: jasmine.arrayContaining(
						coffee.flavors.map(name => jasmine.objectContaining({ name })),
					),
				});
				expect(body).toEqual(expectedCoffee);
			})
		;
	});
	it.todo('Get all [GET /]');
	it.todo('Get one [GET /:id]');
	it.todo('Update one [PATCH /:id]');
	it.todo('Delete one [DELETE /:id]');

	afterAll(async () => {
		await app.close();
	});
});
