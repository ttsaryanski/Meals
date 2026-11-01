import { Link } from "expo-router";
import { useState } from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Image } from "@/utils/expo-image";
import { AntDesign, Ionicons } from "@expo/vector-icons";

type IngredientCardProps = Ingredient & {
    onPress?: () => void;
};
const IngredientCard = ({
    idIngredient,
    strIngredient,
    strDescription,
    strThumb,
    strType,
}: IngredientCardProps) => {
    const [modalVisible, setModalVisible] = useState(false);
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    const insets = useSafeAreaInsets();

    return (
        <>
            <TouchableOpacity
                className="w-[30%]"
                onPress={() => setModalVisible(true)}
            >
                <Image
                    source={
                        strThumb
                            ? `${strThumb}/small`
                            : "https://placehold.co/500x400/0F0D23/A8B5DB.png"
                    }
                    className="w-full h-52 rounded-lg bg-[#0F0D23]"
                    contentFit="contain"
                    cachePolicy="memory-disk"
                    recyclingKey={idIngredient}
                />

                <Text
                    className="text-sm font-bold text-light-200 my-2"
                    numberOfLines={1}
                >
                    {strIngredient}
                </Text>
            </TouchableOpacity>
            <Modal
                visible={modalVisible}
                statusBarTranslucent
                navigationBarTranslucent
                onRequestClose={() => setModalVisible(!modalVisible)}
            >
                <View
                    className={`flex-1 bg-primary items-center ${isLandscape ? "px-16" : ""}`}
                    style={{
                        paddingTop: insets.top,
                        paddingBottom: insets.bottom,
                    }}
                >
                    <ScrollView
                        contentContainerStyle={{
                            paddingBottom: isLandscape ? 10 : 70,
                        }}
                    >
                        <Image
                            source={{
                                uri: `${strThumb}`,
                            }}
                            className={`self-center w-full aspect-square`}
                            contentFit="fill"
                            transition={200}
                            cachePolicy="memory-disk"
                        />

                        <View className="relative flex-row items-center justify-start mt-5 px-5">
                            <Link
                                href={{
                                    pathname: "/ingredients/[ingredient]",
                                    params: { ingredient: strIngredient },
                                }}
                                asChild
                            >
                                <Pressable className="flex-row items-center justify-between w-full">
                                    <Text className="text-lg text-light-200 font-bold py-3">
                                        View Meals with
                                    </Text>

                                    <Ionicons
                                        name="caret-forward-sharp"
                                        size={24}
                                        color="#A8B5DB"
                                    />
                                </Pressable>
                            </Link>
                        </View>

                        <View className="flex-col items-start justify-center mt-5 px-5">
                            <View className="flex-row items-center justify-between w-full">
                                <Text className="text-light-200 font-bold text-2xl">
                                    {strIngredient}
                                </Text>
                            </View>

                            <MealInfo
                                label="Description"
                                value={strDescription}
                            />

                            <MealInfo label="Type" value={strType} />
                        </View>
                    </ScrollView>

                    <Pressable
                        onPress={() => setModalVisible(!modalVisible)}
                        className="my-4 bg-transparent p-3 rounded-full"
                    >
                        <AntDesign
                            name="close-circle"
                            size={24}
                            color="#A8B5DB"
                        />
                    </Pressable>
                </View>
            </Modal>
        </>
    );
};

export default IngredientCard;

const MealInfo = ({ label, value, flag }: MealInfoProps) => (
    <View className="flex-col items-start justify-center mt-5">
        <Text className="text-light-200 font-normal text-base">{label}</Text>

        <View className="flex-row items-center mt-2">
            <Text className="text-light-200 font-bold text-base">
                {value || "N/A"}
            </Text>

            {flag ? (
                <Text
                    style={{
                        fontSize: 24,
                        marginLeft: 12,
                        includeFontPadding: true,
                    }}
                >
                    {flag}
                </Text>
            ) : null}
        </View>
    </View>
);
