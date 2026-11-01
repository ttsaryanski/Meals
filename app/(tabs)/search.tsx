import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Pressable,
    ScrollView,
    Text,
    useWindowDimensions,
    View,
} from "react-native";

import useFetch from "@/hooks/useFetch";
import { mealServices } from "@/services/mealServices";
import { trendServices } from "@/services/trendServices";

import MealCard from "@/components/meal-card";
import SearchBar from "@/components/search-bar";

import { Ionicons } from "@expo/vector-icons";

import { alphabet } from "@/constants/alphabet";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

const Search = () => {
    const listRef = useRef<FlatList>(null);
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Meals | null>(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState<Error | null>(null);
    const [isFirstLetterSearch, setIsFirstLetterSearch] = useState(false);

    const [showScrollToTop, setShowScrollToTop] = useState(false);

    const {
        data: randomMeals,
        loading: randomLoading,
        error: randomError,
    } = useFetch(() => mealServices.getLatest());

    const handleSearch = (text: string) => {
        setQuery(text);
        setIsFirstLetterSearch(false);
    };

    useEffect(() => {
        const trimmedQuery = query.trim();

        if (!trimmedQuery) {
            setSearchResults(null);
            setSearchError(null);
            setSearchLoading(false);
            return;
        }

        let cancelled = false;

        const searchMeals = async () => {
            setSearchLoading(true);
            setSearchError(null);

            try {
                const results = isFirstLetterSearch
                    ? await mealServices.searchByFirstLetter(trimmedQuery)
                    : await mealServices.searchByName(trimmedQuery);

                if (!cancelled) {
                    setSearchResults(results);
                }
            } catch (error) {
                if (!cancelled) {
                    setSearchError(
                        error instanceof Error
                            ? error
                            : new Error("An unknown error occurred"),
                    );
                }
            } finally {
                if (!cancelled) {
                    setSearchLoading(false);
                }
            }
        };

        searchMeals();

        return () => {
            cancelled = true;
        };
    }, [query, isFirstLetterSearch]);

    const meals = query.trim() ? searchResults : randomMeals;
    const loading = query.trim() ? searchLoading : randomLoading;
    const error = query.trim() ? searchError : randomError;

    const handleMealPress = (meal: IncrementCountData) => {
        if (!query.trim()) {
            return;
        }

        trendServices.incrementCount(meal).catch(() => {});
    };

    const handleLetterSearch = (letter: string) => {
        setQuery(letter);
        setIsFirstLetterSearch(true);
    };

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
                scrollEventThrottle={16}
                data={meals?.meals ?? []}
                renderItem={({ item }) => (
                    <MealCard
                        {...item}
                        onPress={() =>
                            handleMealPress({
                                title: item.strMeal,
                                meal_id: Number(item.idMeal),
                                img_url: item.strMealThumb,
                            })
                        }
                    />
                )}
                keyExtractor={(item) => item.idMeal.toString()}
                numColumns={2}
                columnWrapperStyle={{
                    justifyContent: "space-between",
                    marginVertical: 16,
                }}
                contentContainerStyle={{
                    paddingHorizontal: 5,
                    paddingBottom: isLandscape ? 50 : 100,
                }}
                ListHeaderComponent={
                    <>
                        <Image
                            source={icons.logo}
                            className="w-12 h-12 mt-12 mb-1 mx-auto"
                        />

                        <View className="mt-5 mb-3">
                            <SearchBar
                                placeholder="Search for a meal by name"
                                value={query}
                                onChangeText={handleSearch}
                            />
                        </View>

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="mb-3"
                        >
                            {alphabet.map((letter) => (
                                <Pressable
                                    key={letter}
                                    onPress={() => handleLetterSearch(letter)}
                                    className={`px-3 py-1 bg-dark-100 rounded-full mr-2 ${isFirstLetterSearch && query === letter ? "bg-light-200" : "bg-dark-100"}`}
                                >
                                    <Text
                                        className={`${isFirstLetterSearch && query === letter ? "text-dark-100" : "text-light-200"}`}
                                    >
                                        {letter}
                                    </Text>
                                </Pressable>
                            ))}
                        </ScrollView>

                        {loading && (
                            <ActivityIndicator
                                size="large"
                                color="#0000ff"
                                className="my-3"
                            />
                        )}

                        {error && (
                            <Text className="text-red-800 text-center mt-10">
                                Error: {error.message}
                            </Text>
                        )}

                        {!loading &&
                            !error &&
                            query.trim() &&
                            (meals?.meals?.length ?? 0) > 0 && (
                                <Text className="text-xl text-light-200 font-bold">
                                    Search Results for{" "}
                                    <Text className="text-accent">{query}</Text>
                                </Text>
                            )}
                    </>
                }
                ListEmptyComponent={
                    !loading && !error ? (
                        <View className="mt-10 px-5">
                            <Text className="text-center text-light-200">
                                {query.trim()
                                    ? "No meal found"
                                    : "Start typing to search for meals"}
                            </Text>
                        </View>
                    ) : undefined
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

export default Search;
