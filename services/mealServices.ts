import { api } from "@/utils/requester";

export const host = `${process.env.EXPO_PUBLIC_BASE_URL}/${process.env.EXPO_PUBLIC_API_KEY}`;

const endPoints = {
    random: `${host}/randomselection.php`,
    latest: `${host}/latest.php`,
    searchByName: (query: string) =>
        `${host}/search.php?s=${encodeURIComponent(query)}`,
    searchByFirstLetter: (letter: string) =>
        `${host}/search.php?f=${encodeURIComponent(letter)}`,
    detailsById: (query: string) => `${host}/lookup.php?i=${query}`,
    filterByIngredient: (ingredient: string) =>
        `${host}/filter.php?i=${ingredient}`,
    filterByCategory: (category: string) => `${host}/filter.php?c=${category}`,
    filterByCountry: (type: string) => `${host}/filter.php?a=${type}`,
    listOptions: (option: string) => `${host}/list.php?${option}=list`,
    listCategories: `${host}/categories.php`,
};

async function getRandom() {
    const response = await api.get<Meals>(endPoints.random);
    const meals = Array.isArray(response.meals) ? response.meals : [];

    return { meals };
}

async function getLatest() {
    const response = await api.get<Meals>(endPoints.latest);
    const meals = Array.isArray(response.meals) ? response.meals : [];
    return { meals };
}

async function searchByName(query: string) {
    const response = await api.get<Meals>(endPoints.searchByName(query));
    const meals = Array.isArray(response.meals) ? response.meals : [];

    return { meals };
}

async function searchByFirstLetter(letter: string) {
    const response = await api.get<Meals>(
        endPoints.searchByFirstLetter(letter),
    );
    const meals = Array.isArray(response.meals) ? response.meals : [];

    return { meals };
}

async function getDetails(query: string) {
    const response = await api.get<Meals>(endPoints.detailsById(query));
    const meals = Array.isArray(response.meals) ? response.meals : [];

    return { meals };
}

async function filterByCountry(type: string) {
    const response = await api.get<Meals>(endPoints.filterByCountry(type));
    const meals = Array.isArray(response.meals) ? response.meals : [];

    return { meals };
}

async function filterByCategory(category: string) {
    const response = await api.get<Meals>(endPoints.filterByCategory(category));
    const meals = Array.isArray(response.meals) ? response.meals : [];

    return { meals };
}

async function filterByIngredient(ingredient: string) {
    const response = await api.get<Meals>(
        endPoints.filterByIngredient(ingredient),
    );
    const meals = Array.isArray(response.meals) ? response.meals : [];

    return { meals };
}

async function getIngredientList(option: string) {
    const response = await api.get<Ingredients>(endPoints.listOptions(option));
    const meals = Array.isArray(response.meals) ? response.meals : [];

    return { meals };
}

async function getSympleCategoryList(option: string) {
    const response = await api.get<SympleCategoryList>(
        endPoints.listOptions(option),
    );
    const meals = Array.isArray(response.meals) ? response.meals : [];

    return { meals };
}

async function listCategories() {
    const response = await api.get<Categories>(endPoints.listCategories);
    const categories = Array.isArray(response.categories)
        ? response.categories
        : [];

    return { categories };
}

export const mealServices = {
    getRandom,
    getLatest,
    searchByName,
    searchByFirstLetter,
    getDetails,
    filterByCountry,
    filterByCategory,
    filterByIngredient,
    getIngredientList,
    getSympleCategoryList,
    listCategories,
};
