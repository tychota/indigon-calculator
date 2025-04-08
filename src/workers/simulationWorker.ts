import { CombinedSettings } from "../config/formConfig";
import { simulateIndigon } from "../logic/simulation";

self.onmessage = (event: MessageEvent<CombinedSettings>) => {
  const result = simulateIndigon(event.data);
  self.postMessage(result);
};
