
export const mergeArrayByField = (fieldString) => {
    return {
        // merging hellhole to get rid of the warning
        merge(existing, incoming, { readField, mergeObjects }) {
            const merged = existing ? existing.slice(0) : [];
            const objFieldToIndex = Object.create(null);
            if (existing) {
                existing.forEach((obj, index) => {
                objFieldToIndex[readField(fieldString, obj)] = index;
                });
            }
            incoming.forEach(obj => {
                const field = readField(fieldString, obj);
                const index = objFieldToIndex[field];
                if (typeof index === "number") {
                // Merge the new obj data with the existing obj data.
                merged[index] = mergeObjects(merged[index], obj);
                } else {
                // First time we've seen this obj in this array.
                objFieldToIndex[field] = merged.length;
                merged.push(obj);
                }
            });
            return merged;
        }
    }
}
   