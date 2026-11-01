import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
    Alert,
    FlatList,
    Image,
    Pressable,
    RefreshControl,
    Text,
    useWindowDimensions,
    View,
} from "react-native";

import useFetch from "@/hooks/useFetch";
import { deleteAllLocalMeals, getLocalSavedMeals } from "@/utils/storage";

import SavedMealCard from "@/components/saved-meal-card";

import { Ionicons } from "@expo/vector-icons";

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

const Save = () => {
    const listRef = useRef<FlatList>(null);
    const [showScrollToTop, setShowScrollToTop] = useState(false);
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    const {
        data: savedMeals,
        loading,
        error,
        refetch,
    } = useFetch(getLocalSavedMeals, false);

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [refetch]),
    );

    const handleRefresh = async () => {
        await refetch();
    };

    const handleDeleteAll = async () => {
        Alert.alert("Clear All", "Clear all saved meals?", [
            {
                text: "Cancel",
                style: "cancel",
            },
            {
                text: "Clear",
                onPress: async () => {
                    await deleteAllLocalMeals();
                    refetch();
                },
            },
        ]);
    };

    const handleScroll = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;

        setShowScrollToTop(offsetY > 400);
    };

    return (
        <View className={`flex-1 bg-primary ${isLandscape ? "px-12" : ""}`}>
            <Image source={images.bg} className="absolute w-full z-0" />

            <FlatList
                ref={listRef}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                data={
                    savedMeals?.sort((a, b) =>
                        a.title.localeCompare(b.title),
                    ) ?? []
                }
                renderItem={({ item }) => <SavedMealCard meal={item} />}
                keyExtractor={(item) => item.meal_id.toString()}
                numColumns={3}
                columnWrapperStyle={{
                    justifyContent: "space-around",
                    marginBottom: 10,
                }}
                contentContainerStyle={{
                    paddingBottom: isLandscape ? 50 : 100,
                }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={handleRefresh}
                        tintColor="#AB8BFF"
                    />
                }
                ListHeaderComponent={
                    <>
                        <View className="relative flex-row items-center justify-center">
                            <Image
                                source={icons.logo}
                                className="w-12 h-12 mt-12 mb-1 mx-auto"
                            />

                            {savedMeals && savedMeals.length > 1 && (
                                <Pressable
                                    onPress={handleDeleteAll}
                                    className="absolute right-2 mt-10 rounded-full bg-accent"
                                >
                                    <Text className=" px-5 py-2 text-dark-100">
                                        Clear all
                                    </Text>
                                </Pressable>
                            )}
                        </View>

                        <Text className="text-lg text-light-200 text-center font-bold mt-5 mb-3">
                            Saved meals
                        </Text>

                        {savedMeals?.length === 0 && (
                            <View className="mt-10 px-5">
                                <Text className="text-light-200 text-center mt-10">
                                    No saved meals.
                                </Text>
                            </View>
                        )}

                        {error && (
                            <Text className="text-red-800 text-center mt-10">
                                Error: {error?.message}
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
                    className={`absolute ${isLandscape ? "right-16 bottom-16" : "right-5 bottom-32"} w-14 h-14 rounded-full bg-dark-100 items-center justify-center`}
                    style={{ elevation: 5 }}
                >
                    <Ionicons name="arrow-up" size={26} color="#A8B5DB" />
                </Pressable>
            )}
        </View>
    );
};

export default Save;
