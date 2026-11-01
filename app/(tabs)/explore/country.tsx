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

import CountryCard from "@/components/country-card";
import SavedMealCard from "@/components/saved-meal-card";

import { Ionicons } from "@expo/vector-icons";

import { countries } from "@/constants/countries";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { randomNumber } from "./category";

const ExploreByCountry = () => {
    const router = useRouter();
    const listRef = useRef<FlatList>(null);
    const countryListRef = useRef<FlatList<(typeof countries)[number]> | null>(
        null,
    );
    const { country } = useLocalSearchParams<{ country: string }>();
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    const [selectedCountry, setSelectedCountry] = useState<string>(
        country ?? "Bulgaria",
    );
    const [showScrollToTop, setShowScrollToTop] = useState(false);

    const handleScroll = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;

        setShowScrollToTop(offsetY > 400);
    };

    const {
        data: meals,
        loading,
        error,
        refetch,
    } = useFetch(() => mealServices.filterByCountry(selectedCountry), false);

    useEffect(() => {
        refetch();
    }, [selectedCountry, refetch]);

    const COUNTRY_ITEM_WIDTH = 77;
    const selectedCountryIndex = countries.findIndex(
        (country) => country.label === selectedCountry,
    );

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
                    paddingBottom: isLandscape ? 50 : 100,
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={refetch}
                        tintColor="#AB8BFF"
                    />
                }
                ListHeaderComponent={
                    <>
                        <View className="relative flex-row items-center justify-center">
                            <Pressable
                                onPress={() => {
                                    router.push("/explore");
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

                        <View className="mt-3 items-center">
                            <FlatList
                                ref={countryListRef}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                className="my-3"
                                data={countries ?? []}
                                contentContainerStyle={{
                                    paddingRight: 3,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                getItemLayout={(_, index) => ({
                                    length: COUNTRY_ITEM_WIDTH,
                                    offset: COUNTRY_ITEM_WIDTH * index,
                                    index,
                                })}
                                onContentSizeChange={() => {
                                    if (selectedCountryIndex >= 0) {
                                        countryListRef.current?.scrollToIndex({
                                            index: selectedCountryIndex,
                                            animated: false,
                                            viewPosition: 0.5,
                                        });
                                    }
                                }}
                                renderItem={({ item }) => (
                                    <View
                                        style={{
                                            width: COUNTRY_ITEM_WIDTH,
                                            alignItems: "center",
                                        }}
                                    >
                                        <CountryCard
                                            label={item.label}
                                            onPress={() =>
                                                setSelectedCountry(item.label)
                                            }
                                            focused={
                                                selectedCountry === item.label
                                            }
                                            flag={item.flag}
                                        />
                                    </View>
                                )}
                                keyExtractor={(item) =>
                                    `${item.label}${randomNumber}`
                                }
                            />
                        </View>

                        <Text className="text-lg text-center text-light-200 font-bold mb-5">
                            Meals from {selectedCountry}
                        </Text>

                        {error && (
                            <Text className="text-red-800 text-center mt-10">
                                Error: {error?.message}
                            </Text>
                        )}

                        {!loading && !error && meals?.meals.length === 0 && (
                            <Text className="text-light-200 text-center mt-10">
                                No country-specific meals.
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

export default ExploreByCountry;
