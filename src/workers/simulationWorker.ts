import { FlatFormValues } from "../config/formConfig";
import { simulateIndigon } from "../logic/simulation";

self.onmessage = (event: MessageEvent<FlatFormValues>) => {
  const result = simulateIndigon(event.data);
  self.postMessage(result);
};
