import { CombinedSettings } from "../config/formConfig";
import { simulateIndigon } from "../logic/simulate";

self.onmessage = (event: MessageEvent<CombinedSettings>) => {
  const result = simulateIndigon(event.data);
  self.postMessage(result);
};
