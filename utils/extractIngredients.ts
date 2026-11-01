type Ingredient = {
    name: string;
    measure: string | null;
};

export const extractIngredients = (meal: Meal): Ingredient[] => {
    if (!meal) {
        return [];
    }

    const ingredients: Ingredient[] = [];

    for (let i = 1; i <= 15; i++) {
        const name = meal[`strIngredient${i}` as keyof Meal];
        const measure = meal[`strMeasure${i}` as keyof Meal];

        if (name) {
            ingredients.push({
                name: name as string,
                measure: measure as string | null,
            });
        }
    }
    return ingredients;
};

export const extractIngredientNames = (name: string): string => {
    const result = name.toLowerCase().replace(/\s+/g, "_");
    return result;
};
