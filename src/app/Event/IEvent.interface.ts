export interface IEvent {
    name: string;
    description: string;
    cost: number;
    ageLimit: number;
    imagePath: File | string;
    endTime: any;
    startTime: any;
    theme: string;
}