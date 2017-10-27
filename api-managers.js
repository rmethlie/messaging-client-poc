
import RosterManager from './roster-manager.js';

const managerClasses = [
  RosterManager
];
let managerInstances;
export function initialzeAPI(store) {
  managerInstances = managerClasses.map((Manager) => {
    return new Manager(store);
  });
}
