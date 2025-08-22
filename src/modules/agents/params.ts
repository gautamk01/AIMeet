import { createLoader, parseAsInteger, parseAsString } from "nuqs/server";

import { DEFAULT_PAGE } from "@/constants";

// this is a server component
export const filterSearchParams = {
  // Just provide the base parser function
  search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }), // This is for urL
  //withDefault is mainly clear this field if it not using
  page: parseAsInteger
    .withDefault(DEFAULT_PAGE)
    .withOptions({ clearOnDefault: true }),
};

export const loadSearchparams = createLoader(filterSearchParams);
