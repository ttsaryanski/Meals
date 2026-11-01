import AsyncStorage from "@react-native-async-storage/async-storage";

const MEALS_KEY = "meals";

export const getLocalSavedMeals = async (): Promise<SavedMeal[]> => {
    const data = await AsyncStorage.getItem(MEALS_KEY);
    return data ? JSON.parse(data) : [];
};

export const saveLocalMeal = async (
    meal: Omit<SavedMeal, "createdAt">,
): Promise<SavedMeal> => {
    const meals = await getLocalSavedMeals();
    const newMeal: SavedMeal = {
        ...meal,
        createdAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(MEALS_KEY, JSON.stringify([newMeal, ...meals]));
    return newMeal;
};

export const deleteLocalMeal = async (id: number): Promise<void> => {
    const meals = await getLocalSavedMeals();
    const filtered = meals.filter((meal) => meal.meal_id !== id);
    await AsyncStorage.setItem(MEALS_KEY, JSON.stringify(filtered));
};

export const deleteAllLocalMeals = async (): Promise<void> => {
    await AsyncStorage.removeItem(MEALS_KEY);
};
