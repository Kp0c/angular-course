import { Ingridient } from '../shared/Ingridient.modal';

export class Recipe {
    private static globalId = 0;
    public id: number;
    public name: string;
    public description: string;
    public imagePath: string;
    public ingridients: Ingridient[];

    constructor(name: string, desc: string, imagePath: string, ingridients: Ingridient[]) {
        this.id = Recipe.globalId++;
        this.name = name;
        this.description = desc;
        this.imagePath = imagePath;
        this.ingridients = ingridients;
    }
}
