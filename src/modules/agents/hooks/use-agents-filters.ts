//it creates a two-way connection between your React component's state and the URL's query parameters (the part after the ?).

import { DEFAULT_PAGE } from "@/constants"
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs"

export const useAgentsFilters = () => {
    return useQueryStates({
        search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }), // This is for urL
        //withDefault is mainly clear this field if it not using
        page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({ clearOnDefault: true }),

    })
}