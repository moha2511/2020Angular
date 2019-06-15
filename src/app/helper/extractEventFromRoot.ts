import { IMyEventRoot } from '../Event/IMyEventRoot.interface';
import { IEvent } from '../Event/IEvent.interface';


export function extractEventFromRoot(rootEvent: IMyEventRoot) {

const event: IEvent = {
    name: rootEvent.name,
    cost: rootEvent.cost,
    description: rootEvent.description,
    ageLimit: rootEvent.ageLimit,
    theme: rootEvent.theme,
    imagePath: rootEvent.imagePath,
    startTime: new Date(rootEvent.startTime),
    endTime: new Date(rootEvent.endTime)
};
return event;
}