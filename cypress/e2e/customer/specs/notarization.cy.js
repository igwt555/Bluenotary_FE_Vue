import { login } from "../functions/login";
import { identityCheck } from "../functions/notarization/identityCheck";
import { meetNotary } from "../functions/notarization/meetNotary";
import { paymentInfo } from "../functions/notarization/paymentInfo";
import { uploadDocument } from "../functions/notarization/uploadDocument";

login()
describe("Start New Notarization", () => {
  uploadDocument();
  identityCheck();
  paymentInfo();
  meetNotary();
});
