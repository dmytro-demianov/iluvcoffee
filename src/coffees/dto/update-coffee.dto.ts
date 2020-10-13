import { PartialType } from "@nestjs/swagger";
import { CreateCoffeeDto } from "./create-coffee.dto";

export class UpdateCoffeeDto extends PartialType(CreateCoffeeDto) {
    // readonly name?: string;
    // readonly brand?: string;
    // readonly flavors?: string[];
}
