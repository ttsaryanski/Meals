import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    FlatList,
    Image,
    Pressable,
    RefreshControl,
    Text,
    useWindowDimensions,
    View,
} from "react-native";

import useFetch from "@/hooks/useFetch";
import { mealServices } from "@/services/mealServices";

import SavedMealCard from "@/components/saved-meal-card";

import { Ionicons } from "@expo/vector-icons";

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

const Category = () => {
    const { category } = useLocalSearchParams<{ category: string }>();
    const router = useRouter();
    const listRef = useRef<FlatList>(null);
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    const [showScrollToTop, setShowScrollToTop] = useState(false);

    const {
        data: meals,
        loading: mealsLoading,
        error: mealsError,
        refetch: mealsRefetch,
    } = useFetch(() => mealServices.filterByCategory(category), false);

    useEffect(() => {
        mealsRefetch();
    }, [category, mealsRefetch]);

    const handleScroll = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;

        setShowScrollToTop(offsetY > 400);
    };

    return (
        <View className={`flex-1 bg-primary ${isLandscape ? "px-12" : ""}`}>
            <Image
                source={images.bg}
                className="flex-1 absolute w-full z-0"
                resizeMode="cover"
            />

            <FlatList
                ref={listRef}
                onScroll={handleScroll}
                data={meals?.meals ?? []}
                renderItem={({ item }) => (
                    <SavedMealCard
                        meal={{
                            meal_id: item.idMeal,
                            title: item.strMeal,
                            img_url: item.strMealThumb,
                            ...item,
                        }}
                    />
                )}
                keyExtractor={(item) => item.idMeal.toString()}
                numColumns={3}
                columnWrapperStyle={{
                    justifyContent: "space-around",
                    marginBottom: 10,
                }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 5,
                    paddingBottom: isLandscape ? 10 : 100,
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={mealsLoading}
                        onRefresh={() => {
                            mealsRefetch();
                        }}
                        tintColor="#AB8BFF"
                    />
                }
                ListHeaderComponent={
                    <>
                        <View className="relative flex-row items-center justify-center">
                            <Pressable
                                onPress={() => {
                                    router.back();
                                }}
                                className="absolute left-0 p-3 mt-10"
                            >
                                <Ionicons
                                    name="caret-back-sharp"
                                    size={24}
                                    color="#A8B5DB"
                                />
                            </Pressable>

                            <Image
                                source={icons.logo}
                                className="w-12 h-12 mt-12 mb-1"
                            />
                        </View>

                        <Text className="text-lg text-light-200 text-center font-bold mt-5 mb-3">
                            Category{" "}
                            <Text className="text-2xl text-light-100">
                                {" "}
                                {category}{" "}
                            </Text>
                        </Text>

                        {mealsError && (
                            <Text className="text-red-800 text-center mt-3">
                                Error: {mealsError?.message}
                            </Text>
                        )}

                        {!mealsLoading &&
                            !mealsError &&
                            meals?.meals.length === 0 && (
                                <Text className="text-light-200 text-center mt-10">
                                    No category-specific meals.
                                </Text>
                            )}
                    </>
                }
            />

            {showScrollToTop && (
                <Pressable
                    onPress={() =>
                        listRef.current?.scrollToOffset({
                            offset: 0,
                            animated: true,
                        })
                    }
                    className={`absolute ${isLandscape ? "right-16 bottom-8" : "right-5 bottom-32"} w-14 h-14 rounded-full bg-dark-100 items-center justify-center`}
                    style={{ elevation: 5 }}
                >
                    <Ionicons name="arrow-up" size={26} color="#A8B5DB" />
                </Pressable>
            )}
        </View>
    );
};

export default Category;
