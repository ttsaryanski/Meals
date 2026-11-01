import { useRouter } from "expo-router";
import {
    Image,
    Linking,
    Modal,
    Pressable,
    ScrollView,
    Share,
    Text,
    useWindowDimensions,
    View,
} from "react-native";

import {
    AntDesign,
    Feather,
    FontAwesome5,
    Ionicons,
    MaterialCommunityIcons,
} from "@expo/vector-icons";

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { versions } from "@/constants/versions";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const About = () => {
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    const [modalVisible, setModalVisible] = useState(false);
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const shareApp = async () => {
        try {
            await Share.share({
                message: [
                    "Meals - A Delicious Journey",
                    //"https://play.google.com/store/apps/details?id=com.ttsaryanski.cocktails",
                ].join("\n\n"),
            });
        } catch (error) {
            console.error("Error sharing app:", error);
        }
    };

    return (
        <View className={`flex-1 bg-primary ${isLandscape ? "px-12" : ""}`}>
            <Image
                source={images.bg}
                className="flex-1 absolute w-full z-0"
                resizeMode="cover"
            />
            <ScrollView
                className="flex-1 px-2"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    minHeight: "100%",
                    ...(isLandscape
                        ? { paddingHorizontal: 10 }
                        : { paddingBottom: 40 }),
                }}
            >
                {/* <View className="relative flex-row items-center justify-center">
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
                    </Pressable> */}

                <Image
                    source={icons.logo}
                    className="w-12 h-12 my-12 mx-auto"
                />
                {/* </View> */}

                <View className="flex-row items-center my-8 pb-5 border-b border-light-200">
                    <Image source={images.logo} className="w-14 h-14" />

                    <View className="flex-col ml-10 justify-center gap-2 flex-shrink">
                        <Text className="text-lg text-light-200 text-left font-bold">
                            Meals - A Delicious Journey
                        </Text>

                        <Text className="text-lg text-light-200 text-left font-bold">
                            Version {versions[0].version}
                        </Text>
                    </View>
                </View>

                {/* <Pressable
                    onPress={() =>
                        Linking.openURL(
                            "https://play.google.com/store/apps/details?id=com.ttsaryanski.cocktails",
                        )
                    }
                    className="flex-row items-center my-8 px-2 pb-5 border-b border-light-200"
                >
                    <MaterialCommunityIcons
                        name="star-plus"
                        size={32}
                        color="#A8B5DB"
                    />

                    <Text className="flex-1 text-lg text-light-200 font-bold ml-4">
                        Rate "Meals - A Delicious Journey" on Google Play
                    </Text>
                </Pressable> */}

                <Pressable
                    onPress={shareApp}
                    className="flex-row items-center my-8 px-2 pb-5 border-b border-light-200"
                >
                    <Feather name="share-2" size={26} color="#A8B5DB" />

                    <Text className="flex-1 text-lg text-light-200 font-bold ml-4">
                        Share "Meals - A Delicious Journey"
                    </Text>
                </Pressable>

                <Pressable
                    onPress={() => setModalVisible(true)}
                    className="flex-row items-center my-8 px-2 pb-5 border-b border-light-200"
                >
                    <MaterialCommunityIcons
                        name="clipboard-text-outline"
                        size={28}
                        color="#A8B5DB"
                    />

                    <Text className="flex-1 text-lg text-light-200 font-bold ml-4">
                        Release Notes
                    </Text>
                </Pressable>
                <Modal
                    visible={modalVisible}
                    statusBarTranslucent
                    navigationBarTranslucent
                    onRequestClose={() => setModalVisible(!modalVisible)}
                >
                    <View
                        className="flex-1 bg-dark-100 items-center p-2"
                        style={{
                            paddingTop: insets.top,
                            paddingBottom: insets.bottom,
                        }}
                    >
                        <Text className="text-lg text-light-200 font-bold my-4">
                            Release Notes
                        </Text>

                        <ScrollView className="flex-1">
                            {versions.map((version) => (
                                <View key={version.id} className="mb-4">
                                    <Text className="text-light-200 font-bold">
                                        Version {version.version}
                                    </Text>

                                    {version.notes.map((note, index) => (
                                        <Text
                                            key={index}
                                            className="text-light-200 pl-3"
                                        >
                                            - {note}
                                        </Text>
                                    ))}
                                </View>
                            ))}
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

                <Pressable
                    onPress={() =>
                        Linking.openURL(
                            "https://ttsaryanski.github.io/Portfolio/",
                        )
                    }
                    className="flex-row items-center my-8 px-2 pb-5 border-b border-light-200"
                >
                    <FontAwesome5
                        name="user-circle"
                        size={26}
                        color="#A8B5DB"
                    />

                    <Text className="flex-1 text-lg text-light-200 font-bold ml-4">
                        Author
                    </Text>

                    <Ionicons
                        name="open-outline"
                        size={20}
                        color="#A8B5DB"
                        className="ml-auto mr-2"
                    />
                </Pressable>

                <Pressable
                    onPress={() =>
                        Linking.openURL(
                            "https://ttsaryanski.github.io/Meals-PrivacyPolicy/",
                        )
                    }
                    className={`flex-row items-center my-8 px-2 pb-5 border-b border-light-200 ${isLandscape ? " mb-20" : "mb-36"}`}
                >
                    <MaterialCommunityIcons
                        name="shield-link-variant-outline"
                        size={26}
                        color="#A8B5DB"
                    />

                    <Text className="flex-1 text-lg text-light-200 font-bold ml-4">
                        Privacy Policy
                    </Text>

                    <Ionicons
                        name="open-outline"
                        size={20}
                        color="#A8B5DB"
                        className="ml-auto mr-2"
                    />
                </Pressable>
            </ScrollView>
        </View>
    );
};

export default About;
