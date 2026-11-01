import { api } from "@/utils/requester";

const host = `${process.env.EXPO_PUBLIC_TRENDING_API_URL}`;

const endPoints = {
    trend: `${host}/top`,
    increment: `${host}/increment`,
};

async function getTrending(): Promise<TrendingMeal[]> {
    const response = await api.get<TrendingMeal[]>(endPoints.trend);
    const trendingMeals = Array.isArray(response) ? response : [];

    return trendingMeals;
}

async function incrementCount(data: IncrementCountData): Promise<void> {
    await api.post(endPoints.increment, data);
}

export const trendServices = { getTrending, incrementCount };
