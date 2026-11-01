interface Meals {
    meals: Meal[];
}

interface Meal {
    idMeal: string;
    strMeal: string;
    strMealAlternate?: string;
    strCategory?: string;
    strArea?: string;
    strCountry?: string;
    strInstructions?: string;
    strMealThumb?: string;
    strTags?: string;
    strYoutube?: string;
    strIngredient1?: string;
    strIngredient2?: string;
    strIngredient3?: string;
    strIngredient4?: string;
    strIngredient5?: string;
    strIngredient6?: string;
    strIngredient7?: string;
    strIngredient8?: string;
    strIngredient9?: string;
    strIngredient10?: string;
    strIngredient11?: string;
    strIngredient12?: string;
    strIngredient13?: string;
    strIngredient14?: string;
    strIngredient15?: string;
    strIngredient16?: string;
    strIngredient17?: string;
    strIngredient18?: string;
    strIngredient19?: string;
    strIngredient20?: string;
    strMeasure1?: string;
    strMeasure2?: string;
    strMeasure3?: string;
    strMeasure4?: string;
    strMeasure5?: string;
    strMeasure6?: string;
    strMeasure7?: string;
    strMeasure8?: string;
    strMeasure9?: string;
    strMeasure10?: string;
    strMeasure11?: string;
    strMeasure12?: string;
    strMeasure13?: string;
    strMeasure14?: string;
    strMeasure15?: string;
    strMeasure16?: string;
    strMeasure17?: string;
    strMeasure18?: string;
    strMeasure19?: string;
    strMeasure20?: string;
    strSource?: string;
    strImageSource?: string;
    strCreativeCommonsConfirmed?: string;
    dateModified?: string;
}

interface TrendingMeal {
    meal_id: number;
    title: string;
    count: number;
    img_url: string;
}

interface IncrementCountData {
    meal_id: number;
    title: string;
    img_url: string;
}

interface MealInfoProps {
    label: string;
    value?: string | number | null;
    flag?: string;
}

interface SavedMeal {
    meal_id: number;
    title: string;
    img_url: string;
    createdAt: string;
}

interface Category {
    idCategory: string;
    strCategory: string;
    strCategoryDescription?: string;
    strCategoryThumb?: string;
}

interface Categories {
    categories: Category[];
}

interface SympleCategoryList {
    meals: {
        strCategory: string;
    }[];
}

interface Ingredient {
    idIngredient: string;
    strIngredient: string;
    strDescription?: string;
    strThumb?: string;
    strType?: string;
}

interface Ingredients {
    meals: Ingredient[];
}

interface Version {
    id: string;
    version: string;
    notes: string[];
}

interface Versions {
    versions: Version[];
}
