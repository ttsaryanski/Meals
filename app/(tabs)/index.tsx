import {
    FlatList,
    Image,
    RefreshControl,
    Text,
    useWindowDimensions,
    View,
} from "react-native";

import useFetch from "@/hooks/useFetch";
import { mealServices } from "@/services/mealServices";
import { trendServices } from "@/services/trendServices";

import MealCard from "@/components/meal-card";
import TrendingMealCard from "@/components/trending-meal-card";

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

export default function Index() {
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    const {
        data: trendingMeals,
        loading: trendingLoading,
        error: trendingError,
        refetch: trendingRefetch,
    } = useFetch(trendServices.getTrending);

    const {
        data: meals,
        loading: mealsLoading,
        error: mealsError,
        refetch: mealsRefetch,
    } = useFetch(() => mealServices.getRandom());

    const handleRefresh = async () => {
        await Promise.all([trendingRefetch(), mealsRefetch()]);
    };

    return (
        <View className={`flex-1 bg-primary ${isLandscape ? "px-12" : ""}`}>
            <Image
                source={images.bg}
                className="absolute w-full z-0"
                resizeMode="cover"
            />

            <FlatList
                className="flex-1 px-2"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    minHeight: "100%",
                    paddingBottom: isLandscape ? 50 : 100,
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={trendingLoading || mealsLoading}
                        onRefresh={handleRefresh}
                        tintColor="#AB8BFF"
                    />
                }
                data={meals?.meals}
                renderItem={({ item }) => <MealCard {...item} />}
                keyExtractor={(item) => item.idMeal.toString()}
                numColumns={2}
                columnWrapperStyle={{
                    justifyContent: "space-between",
                    marginBottom: 10,
                }}
                ListHeaderComponent={
                    <>
                        <Image
                            source={icons.logo}
                            className="w-12 h-12 mt-12 mb-1 mx-auto"
                        />

                        {trendingMeals && (
                            <View className="mt-3">
                                <Text className="text-lg text-light-200 text-center font-bold mb-3">
                                    Trending meals
                                </Text>

                                <FlatList
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    className="mb-4 mt-3"
                                    data={trendingMeals}
                                    contentContainerStyle={{
                                        paddingRight: 20,
                                    }}
                                    renderItem={({ item, index }) => (
                                        <TrendingMealCard
                                            meal={item}
                                            index={index}
                                        />
                                    )}
                                    keyExtractor={(item) =>
                                        item.meal_id.toString()
                                    }
                                    ItemSeparatorComponent={() => (
                                        <View className="w-10" />
                                    )}
                                />
                            </View>
                        )}

                        {trendingError && (
                            <View className="mt-3">
                                <Text className="text-lg text-light-200 text-center font-bold mb-3">
                                    Trending meals
                                </Text>

                                <Text className="text-red-800 text-center mt-5">
                                    Error: {trendingError?.message}
                                </Text>
                            </View>
                        )}

                        <Text className="text-lg text-light-200 text-center font-bold mt-5 mb-3">
                            Random Meals
                        </Text>

                        {mealsError && (
                            <Text className="text-red-800 text-center mt-10">
                                Error:{" "}
                                {mealsError?.message || trendingError?.message}
                            </Text>
                        )}
                    </>
                }
            />
        </View>
    );
}
