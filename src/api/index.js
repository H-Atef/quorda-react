// ------------------------------------------------------------
// Pre-built clients for each API version.
// Import the specific version you need at the call site.
// ------------------------------------------------------------

import { createVersionedClient } from './clientFactory';

export const apiV1 = createVersionedClient('v1');

export default apiV1;