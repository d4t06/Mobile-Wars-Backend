/// <reference types="multer" />
import { ImagesService } from './images.service';
export declare class ImagesController {
    private readonly imagesService;
    constructor(imagesService: ImagesService);
    create(file: Express.Multer.File): Promise<import("./dto/create-image.dto").CreateImageDto & import("./entities/image.entity").Image>;
    findAll(page: number): Promise<{
        page: number;
        pageSize: number;
        count: number;
        images: import("./entities/image.entity").Image[];
    }>;
    remove(id: string): Promise<void>;
}
