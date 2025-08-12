import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  Dimensions,
  StatusBar,
  SafeAreaView,
  Image,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Font from 'expo-font';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// 中文字体预设 - 使用自定义字体文件
const FONTS = [
  { name: '系统默认', value: 'System' },
  { name: '汉仪新蒂宝塔体', value: 'HanyiSentyPagoda' },
  { name: 'Dymon手写体', value: 'DymonShouXieTi' },
  { name: 'DF力王黑体', value: 'DFLiKingHei1B' },
  { name: '包图小白体', value: 'BaotuXiaobaiti' },
  { name: '新蒂剪纸体', value: 'SentyPaperCut' },
  { name: 'Oz焦糖体', value: 'OzCaramel' },
  { name: '汉仪新蒂春意体', value: 'HanyiSentySpringBrush' },
  { name: '源柔大正宋体', value: 'YRDZST' },
  { name: 'Slidefu字体', value: 'Slidefu' },
  { name: '字魂乌龙茶', value: 'ZiHunWuLongCha' },
  { name: '字魂白鸽天行体', value: 'ZiHunBaiGeTianXing' },
  { name: '汉仪白清体', value: 'HanYiBaiQingTi' },
  { name: '汉仪彩蝶体', value: 'HanYiCaiDieTi' },
  { name: '美人的字', value: 'MeiRenDeZi' },
  { name: '阿猪泡泡体', value: 'AZhuPaoPaoTi' },
  { name: '思源黑体', value: 'SourceHanSansCN' },
];

// 预设颜色
const COLORS = [
  '#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
  '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB', '#A52A2A',
  '#808080', '#008000', '#000080', '#800000', '#808000', '#008080',
];

// 背景预设
const BACKGROUND_PRESETS: BackgroundType[] = [
  { type: 'solid', color: '#FFFFFF', name: '白色' },
  { type: 'solid', color: '#000000', name: '黑色' },
  { type: 'solid', color: '#FF0000', name: '红色' },
  { type: 'solid', color: '#0000FF', name: '蓝色' },
  { type: 'gradient', colors: ['#FF6B6B', '#4ECDC4'], name: '日落' },
  { type: 'gradient', colors: ['#A8EDEA', '#FED6E3'], name: '粉色梦境' },
  { type: 'gradient', colors: ['#FFE53B', '#FF2525'], name: '火焰' },
  { type: 'gradient', colors: ['#21D4FD', '#B721FF'], name: '海洋' },
  { type: 'gradient', colors: ['#FC466B', '#3F5EFB'], name: '紫色天空' },
  { type: 'transparent', name: '透明' },
];

// 图片背景预设 - 按类别组织
const PICTURE_BACKGROUNDS = [
  // 纹理和做旧背景
  { id: 1, name: '白色纹理', uri: require('./assets/images/white-texture.jpg'), category: '纹理' },
  { id: 2, name: '白色做旧墙纹理', uri: require('./assets/images/white-grungy-wall-textured-background.avif'), category: '纹理' },
  { id: 3, name: '灰尘做旧纹理', uri: require('./assets/images/dusty-grunge-style-texture-background.avif'), category: '纹理' },
  { id: 4, name: '做旧复古纹理', uri: require('./assets/images/grunge-texture-vintage-background.avif'), category: '纹理' },
  { id: 5, name: '胶片纹理细节', uri: require('./assets/images/close-up-film-texture-details_background.avif'), category: '纹理' },
  { id: 6, name: '老式复古背景', uri: require('./assets/images/old-vintage-background.avif'), category: '纹理' },
  { id: 7, name: '黑色混凝土纹理', uri: require('./assets/images/grunge-black-concrete-textured-background.avif'), category: '纹理' },
  { id: 8, name: '纹理背景', uri: require('./assets/images/texture-background.avif'), category: '纹理' },
  { id: 9, name: '混凝土墙纹理', uri: require('./assets/images/concrete-wall-texture.avif'), category: '纹理' },
  { id: 10, name: '地面纹理图案', uri: require('./assets/images/photo-ground-texture-pattern.avif'), category: '纹理' },
  { id: 11, name: '复古黑色做旧纹理', uri: require('./assets/images/vintage-black-grunge-textures-background-vector-illustration.avif'), category: '纹理' },
  { id: 12, name: '织物纹理背景', uri: require('./assets/images/fabric-texture-background.avif'), category: '纹理' },
  { id: 13, name: '设计空间染色纸纹理', uri: require('./assets/images/design-space-stained-paper-textured-background.avif'), category: '纹理' },
  { id: 14, name: '棕色纹理', uri: require('./assets/images/brown-texture.avif'), category: '纹理' },
  { id: 15, name: '简单米色纹理背景', uri: require('./assets/images/simple-beige-texture-background.avif'), category: '纹理' },
  { id: 16, name: '全帧织物拍摄', uri: require('./assets/images/full-frame-shot-fabric.jpg'), category: '纹理' },

  // 抽象和艺术背景
  { id: 17, name: '抽象水彩画', uri: require('./assets/images/abstract-watercolor-painting.jpg'), category: '抽象艺术' },
  { id: 18, name: '动态模糊水彩', uri: require('./assets/images/motion-blur-coloured-handmade-technique-aquarelle.jpg'), category: '抽象艺术' },
  { id: 19, name: '闪亮抽象背景', uri: require('./assets/images/glitter-abstract-background.jpg'), category: '抽象艺术' },
  { id: 20, name: '现代抽象银白圆圈', uri: require('./assets/images/modern-abstract-silver-white-gray-circles-background-elegant-monochrome.jpg'), category: '抽象艺术' },
  { id: 21, name: '彩色抽象背景', uri: require('./assets/images/colorful-abstract-background.jpg'), category: '抽象艺术' },
  { id: 22, name: '彩色渐变颗粒背景', uri: require('./assets/images/colorful-gradient-grainy-gradient-background.avif'), category: '抽象艺术' },
  { id: 23, name: '彩色颗粒渐变背景', uri: require('./assets/images/colorful-grainy-gradient-background.avif'), category: '抽象艺术' },
  { id: 24, name: '抽象彩色渐变纹理', uri: require('./assets/images/abstract-colorful-gradient-background-texture-grainy.avif'), category: '抽象艺术' },
  { id: 25, name: '背景绘画静物', uri: require('./assets/images/background-paint-still-life.jpg'), category: '抽象艺术' },
  { id: 26, name: '红色抽象山脉图案', uri: require('./assets/images/red-abstract-mountains-pattern.avif'), category: '抽象艺术' },
  { id: 27, name: '抽象背景设计硬光红沙', uri: require('./assets/images/abstract-background-design-hd-hardlight-red-sand-color.jpg'), category: '抽象艺术' },

  // 文化和主题背景
  { id: 28, name: '日式红金波浪图案', uri: require('./assets/images/japanese-themed-red-gold-wave-pattern.avif'), category: '文化主题' },
  { id: 29, name: '复古锦鲤装饰背景', uri: require('./assets/images/vintage-koi-fish-decorated-background.avif'), category: '文化主题' },
  { id: 30, name: '平面设计韩式图案', uri: require('./assets/images/flat-design-korean-pattern-design.avif'), category: '文化主题' },
  { id: 31, name: '平面设计韩式图案', uri: require('./assets/images/flat-design-korean-pattern.avif'), category: '文化主题' },
  { id: 32, name: '中国风棕色图案背景', uri: require('./assets/images/background-with-brown-chinese-patterns.avif'), category: '文化主题' },

  // 自然和有机背景
  { id: 33, name: '蓝天白云背景', uri: require('./assets/images/blue-background-with-white-cloud-blue-background.jpg'), category: '自然' },
  { id: 34, name: '彩色洒粉地面', uri: require('./assets/images/overhead-view-holi-color-ground.jpg'), category: '自然' },
  { id: 35, name: '雪花背景节日冬季', uri: require('./assets/images/snowflake-background-festive-winter-holiday-design-beige.avif'), category: '自然' },

  // 现代和设计背景
  { id: 36, name: '装饰玫瑰金艺术图案', uri: require('./assets/images/decorative-rose-gold-art-pattern.avif'), category: '现代设计' },
  { id: 37, name: '线性平面抽象线条', uri: require('./assets/images/linear-flat-abstract-lines-pattern.avif'), category: '现代设计' },
  { id: 38, name: '渐变装饰艺术图案', uri: require('./assets/images/gradient-art-deco-pattern.avif'), category: '现代设计' },

  // 其他背景
  { id: 39, name: '红砖墙像素艺术', uri: require('./assets/images/seamless-red-brick-wall-pixel-art-patttern.jpg'), category: '其他' },
  { id: 40, name: '像素砖墙图案', uri: require('./assets/images/pixel-brick-wall-seamless-pattern.jpg'), category: '其他' },
  { id: 41, name: '红色纹理背景', uri: require('./assets/images/red-background-with-texture.avif'), category: '其他' },
  { id: 42, name: '米色纹理背景', uri: require('./assets/images/beige-textured-background.avif'), category: '其他' },
  { id: 43, name: '红色背景', uri: require('./assets/images/red-background.jpg'), category: '其他' },
  { id: 44, name: '红色纸张背景', uri: require('./assets/images/red-paper-background.jpg'), category: '其他' },
  { id: 45, name: '老式纸张纹理红框', uri: require('./assets/images/old-paper-texture-with-red-line-frame-abstract-background.jpg'), category: '其他' },
];

// 背景类型定义
type BackgroundType = 
  | { type: 'solid'; color: string; name: string }
  | { type: 'gradient'; colors: readonly [string, string, ...string[]]; name: string }
  | { type: 'transparent'; name: string }
  | { type: 'picture'; uri: any; name: string };

// 文字对齐选项
const TEXT_ALIGNMENTS = ['left', 'center', 'right', 'justify'] as const;

export default function App() {
  const [text, setText] = useState('您的文字');
  const [fontSize, setFontSize] = useState(24);
  const [fontFamily, setFontFamily] = useState('System');
  const [textColor, setTextColor] = useState('#000000');
  const [selectedBackground, setSelectedBackground] = useState<BackgroundType>(BACKGROUND_PRESETS[0]);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right' | 'justify'>('center');
  const [showFontModal, setShowFontModal] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);
  const [showBackgroundModal, setShowBackgroundModal] = useState(false);
  const [showPictureModal, setShowPictureModal] = useState(false);
  const [isEditingText, setIsEditingText] = useState(false);
  const [canvasRatio, setCanvasRatio] = useState('1:1'); // 1:1, 16:9, 4:3, 3:4
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [fontKey, setFontKey] = useState(0); // Force re-render when font changes
  const [customFonts, setCustomFonts] = useState<Array<{name: string, value: string, uri: string}>>([]);
  const [allFonts, setAllFonts] = useState<Array<{name: string, value: string}>>([]);
  const [selectedPictureCategory, setSelectedPictureCategory] = useState<string>('全部');
  
  const viewShotRef = useRef<ViewShot>(null);

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    loadFonts();
    loadCustomFonts();
  }, []);

  useEffect(() => {
    // Combine built-in fonts with custom fonts
    setAllFonts([
      ...FONTS,
      ...customFonts.map(font => ({ name: font.name, value: font.value }))
    ]);
  }, [customFonts]);

  const loadFonts = async () => {
    try {
      // Load custom fonts if needed
      await Font.loadAsync({
        // You can add custom font files here
        // 'CustomFont': require('./assets/fonts/CustomFont.ttf'),
        HanyiSentyPagoda: require('./assets/fonts/HanyiSentyPagoda Regular.ttf'),
        DymonShouXieTi: require('./assets/fonts/Dymon-ShouXieTi.otf'),
        DFLiKingHei1B: require('./assets/fonts/DFLiKingHei1B Regular.ttf'),
        BaotuXiaobaiti: require('./assets/fonts/baotuxiaobaiti Regular.ttf'),
        SentyPaperCut: require('./assets/fonts/SentyPaperCut Regular.ttf'),
        OzCaramel: require('./assets/fonts/OzCaramel Regular.ttf'),
        HanyiSentySpringBrush: require('./assets/fonts/HanyiSentySpringBrush Regular.ttf'),
        YRDZST: require('./assets/fonts/YRDZST Semibold.ttf'),
        Slidefu: require('./assets/fonts/Slidefu-Regular-2.ttf'),
        ZiHunWuLongCha: require('./assets/fonts/字魂乌龙茶(商用需授权).ttf'),
        ZiHunBaiGeTianXing: require('./assets/fonts/字魂白鸽天行体(商用需授权).ttf'),
        HanYiBaiQingTi: require('./assets/fonts/HanYiBaiQingTiJian-1.ttf'),
        HanYiCaiDieTi: require('./assets/fonts/HanYiCaiDieTiJian-1.ttf'),
        MeiRenDeZi: require('./assets/fonts/MeiRenDeZi-2.ttf'),
        AZhuPaoPaoTi: require('./assets/fonts/AZhuPaoPaoTi-2.ttf'),
        SourceHanSansCN: require('./assets/fonts/Source Han Sans CN Light.otf'),
      });
      
      // Force a re-render after fonts are loaded
      setFontKey(prev => prev + 1);
      setFontsLoaded(true);
    } catch (error) {
      console.log('Font loading error:', error);
      setFontsLoaded(true); // Continue anyway
    }
  };

  const loadCustomFonts = async () => {
    try {
      const savedFonts = await AsyncStorage.getItem('customFonts');
      if (savedFonts) {
        const fonts = JSON.parse(savedFonts);
        setCustomFonts(fonts);
        
        // Reload custom fonts
        const fontObjects: { [key: string]: any } = {};
        fonts.forEach((font: any) => {
          fontObjects[font.value] = font.uri;
        });
        
        if (Object.keys(fontObjects).length > 0) {
          await Font.loadAsync(fontObjects);
        }
      }
    } catch (error) {
      console.log('Error loading custom fonts:', error);
    }
  };

  const saveCustomFonts = async (fonts: Array<{name: string, value: string, uri: string}>) => {
    try {
      await AsyncStorage.setItem('customFonts', JSON.stringify(fonts));
    } catch (error) {
      console.log('Error saving custom fonts:', error);
    }
  };

  const refreshFont = () => {
    // Force re-render of text components
    setFontKey(prev => prev + 1);
    
    // Clear text input focus to force re-render
    if (isEditingText) {
      setIsEditingText(false);
      setTimeout(() => setIsEditingText(true), 100);
    }
    
    // Show feedback to user
    Alert.alert('字体已刷新', '字体已重新加载，请查看效果');
  };

  const pickCustomFont = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['font/*', 'application/x-font-ttf', 'application/x-font-otf'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];
      if (!file) {
        Alert.alert('错误', '无法读取字体文件');
        return;
      }

      // Extract font name from filename
      const fileName = file.name || 'CustomFont';
      const fontName = fileName.replace(/\.(ttf|otf)$/i, '');
      const fontValue = `CustomFont_${Date.now()}`;

      // Load the custom font
      try {
        await Font.loadAsync({
          [fontValue]: file.uri,
        });

        // Add to custom fonts
        const newCustomFont = {
          name: fontName,
          value: fontValue,
          uri: file.uri,
        };

        const updatedFonts = [...customFonts, newCustomFont];
        setCustomFonts(updatedFonts);
        await saveCustomFonts(updatedFonts);
        
        // Force re-render
        setFontKey(prev => prev + 1);
        
        Alert.alert('成功', `字体 "${fontName}" 已成功加载！`);
      } catch (error) {
        Alert.alert('错误', '字体加载失败，请检查文件格式');
        console.log('Font loading error:', error);
      }
    } catch (error) {
      Alert.alert('错误', '选择字体文件失败');
      console.log('Document picker error:', error);
    }
  };

  const getFontFamily = (fontValue: string) => {
    // For custom fonts, just return the font value directly
    // The fonts are loaded with Font.loadAsync, so they should work on both platforms
    return fontValue;
  };

  const handleShare = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      if (viewShotRef.current) {
        const uri = await viewShotRef.current.capture();
        
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri, {
            mimeType: 'image/png',
            dialogTitle: '分享您的文字艺术',
          });
        }
      }
    } catch (error) {
      Alert.alert('错误', '分享图片失败');
    }
  };

  const handleSave = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('需要权限', '请授权访问相册以保存图片');
        return;
      }

      if (viewShotRef.current) {
        const uri = await viewShotRef.current.capture();
        await MediaLibrary.saveToLibraryAsync(uri);
        Alert.alert('成功', '图片已保存到相册！');
      }
    } catch (error) {
      Alert.alert('错误', '保存图片失败');
    }
  };

  const getCanvasStyle = () => {
    const baseWidth = screenWidth - 40;
    let canvasWidth = baseWidth;
    let canvasHeight = baseWidth;

    switch (canvasRatio) {
      case '16:9':
        canvasHeight = (baseWidth * 9) / 16;
        break;
      case '4:3':
        canvasHeight = (baseWidth * 3) / 4;
        break;
      case '3:4':
        canvasHeight = (baseWidth * 4) / 3;
        break;
      default:
        canvasHeight = baseWidth;
    }

    return { width: canvasWidth, height: Math.min(canvasHeight, screenHeight * 0.4) };
  };

  const renderBackground = () => {
    const style = getCanvasStyle();
    
    if (selectedBackground.type === 'transparent') {
      return (
        <View style={[styles.canvas, style, { backgroundColor: 'transparent' }]}>
          <View style={styles.transparentPattern} />
        </View>
      );
    } else if (selectedBackground.type === 'gradient' && selectedBackground.colors) {
      return (
        <LinearGradient
          colors={selectedBackground.colors}
          style={[styles.canvas, style]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      );
    } else if (selectedBackground.type === 'picture' && selectedBackground.uri) {
      return (
        <View style={[styles.canvas, style, { backgroundColor: 'transparent' }]}>
          <Image source={selectedBackground.uri} style={styles.pictureBackground} />
        </View>
      );
    } else if (selectedBackground.type === 'solid' && selectedBackground.color) {
      return (
        <View style={[styles.canvas, style, { backgroundColor: selectedBackground.color }]} />
      );
    } else {
      return (
        <View style={[styles.canvas, style, { backgroundColor: '#FFFFFF' }]} />
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradient}>
        {!fontsLoaded ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>正在加载字体...</Text>
          </View>
        ) : (
          <>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>文字艺术</Text>
              <View style={styles.headerButtons}>
                <TouchableOpacity style={styles.headerButton} onPress={handleSave}>
                  <Ionicons name="save" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
                  <Ionicons name="share" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
              {/* 画布预览 */}
              <View style={styles.canvasContainer}>
                <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1.0 }}>
                  <View style={styles.canvasWrapper}>
                    {renderBackground()}
                    <View style={[styles.textContainer, getCanvasStyle()]}>
                      {isEditingText ? (
                        <TextInput
                          key={`input-${fontKey}`}
                          style={[
                            styles.textInput,
                            {
                              fontSize,
                              fontFamily: getFontFamily(fontFamily),
                              color: textColor,
                              textAlign,
                            },
                          ]}
                          value={text}
                          onChangeText={setText}
                          onBlur={() => setIsEditingText(false)}
                          multiline
                          autoFocus
                          blurOnSubmit
                          placeholder="输入您的文字..."
                        />
                      ) : (
                        <TouchableOpacity
                          onPress={() => setIsEditingText(true)}
                          style={styles.textTouchable}
                        >
                          <Text
                            key={`display-${fontKey}`}
                            style={[
                              styles.displayText,
                              {
                                fontSize,
                                fontFamily: getFontFamily(fontFamily),
                                color: textColor,
                                textAlign,
                              },
                            ]}
                          >
                            {text}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </ViewShot>
              </View>

              {/* 控制面板 */}
              <View style={styles.controls}>
                {/* 文字大小控制 */}
                <View style={styles.controlSection}>
                  <Text style={styles.controlLabel}>文字大小: {fontSize}</Text>
                  <View style={styles.sizeControls}>
                    <TouchableOpacity
                      style={styles.sizeButton}
                      onPress={() => setFontSize(Math.max(10, fontSize - 2))}
                    >
                      <Ionicons name="remove" size={20} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.sizeButton}
                      onPress={() => setFontSize(Math.min(72, fontSize + 2))}
                    >
                      <Ionicons name="add" size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* 字体选择 */}
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => setShowFontModal(true)}
                >
                  <Ionicons name="text" size={20} color="white" />
                  <Text style={styles.controlButtonText}>
                    字体: {FONTS.find(f => f.value === fontFamily)?.name || fontFamily}
                  </Text>
                  <Text style={styles.fontDebug}>
                    {getFontFamily(fontFamily)} | 字体ID: {fontKey}
                  </Text>
                </TouchableOpacity>

                {/* 文字颜色 */}
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => setShowColorModal(true)}
                >
                  <View style={[styles.colorPreview, { backgroundColor: textColor }]} />
                  <Text style={styles.controlButtonText}>文字颜色</Text>
                </TouchableOpacity>

                {/* 背景 */}
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => setShowBackgroundModal(true)}
                >
                  <Ionicons name="image" size={20} color="white" />
                  <Text style={styles.controlButtonText}>背景: {selectedBackground.name}</Text>
                </TouchableOpacity>

                {/* 图片背景 */}
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => setShowPictureModal(true)}
                >
                  <Ionicons name="images" size={20} color="white" />
                  <Text style={styles.controlButtonText}>图片背景</Text>
                </TouchableOpacity>

                {/* 文字对齐 */}
                <View style={styles.controlSection}>
                  <Text style={styles.controlLabel}>文字对齐</Text>
                  <View style={styles.alignmentButtons}>
                    {TEXT_ALIGNMENTS.map((alignment) => (
                      <TouchableOpacity
                        key={alignment}
                        style={[
                          styles.alignmentButton,
                          textAlign === alignment && styles.alignmentButtonActive,
                        ]}
                        onPress={() => setTextAlign(alignment)}
                      >
                        <Ionicons
                          name={
                            alignment === 'left'
                              ? 'text'
                              : alignment === 'center'
                              ? 'text'
                              : alignment === 'right'
                              ? 'text'
                              : 'text'
                          }
                          size={16}
                          color={textAlign === alignment ? '#667eea' : 'white'}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* 画布比例 */}
                <View style={styles.controlSection}>
                  <Text style={styles.controlLabel}>画布比例</Text>
                  <View style={styles.ratioButtons}>
                    {['1:1', '16:9', '4:3', '3:4'].map((ratio) => (
                      <TouchableOpacity
                        key={ratio}
                        style={[
                          styles.ratioButton,
                          canvasRatio === ratio && styles.ratioButtonActive,
                        ]}
                        onPress={() => setCanvasRatio(ratio)}
                      >
                        <Text
                          style={[
                            styles.ratioButtonText,
                            canvasRatio === ratio && styles.ratioButtonTextActive,
                          ]}
                        >
                          {ratio}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </ScrollView>

            {/* 字体模态框 */}
            <Modal visible={showFontModal} transparent animationType="slide">
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>选择字体</Text>
                    <View style={styles.modalHeaderButtons}>
                      <TouchableOpacity onPress={refreshFont} style={styles.refreshButton}>
                        <Ionicons name="refresh" size={20} color="#667eea" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setShowFontModal(false)}>
                        <Ionicons name="close" size={24} color="black" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  {/* Custom Font Section */}
                  <View style={styles.customFontSection}>
                    <TouchableOpacity style={styles.addFontButton} onPress={pickCustomFont}>
                      <Ionicons name="add-circle" size={24} color="#667eea" />
                      <Text style={styles.addFontText}>添加自定义字体</Text>
                    </TouchableOpacity>
                    <Text style={styles.customFontInfo}>
                      支持 TTF 和 OTF 格式
                    </Text>
                    
                    {/* Custom Fonts List */}
                    {customFonts.length > 0 && (
                      <View style={styles.customFontsList}>
                        <Text style={styles.customFontsTitle}>已添加的字体:</Text>
                        {customFonts.map((font, index) => (
                          <View key={font.value} style={styles.customFontItem}>
                            <Text style={styles.customFontName}>{font.name}</Text>
                            <TouchableOpacity
                              style={styles.removeFontButton}
                              onPress={() => {
                                Alert.alert(
                                  '删除字体',
                                  `确定要删除字体 "${font.name}" 吗？`,
                                  [
                                    { text: '取消', style: 'cancel' },
                                    {
                                      text: '删除',
                                      style: 'destructive',
                                      onPress: () => {
                                        const updatedFonts = customFonts.filter(f => f.value !== font.value);
                                        setCustomFonts(updatedFonts);
                                        saveCustomFonts(updatedFonts);
                                        if (fontFamily === font.value) {
                                          setFontFamily('System');
                                        }
                                        setFontKey(prev => prev + 1);
                                      }
                                    }
                                  ]
                                );
                              }}
                            >
                              <Ionicons name="trash" size={16} color="#ff4444" />
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>

                  <ScrollView>
                    {allFonts.map((font) => (
                      <TouchableOpacity
                        key={font.value}
                        style={[
                          styles.modalItem,
                          fontFamily === font.value && styles.modalItemActive,
                        ]}
                        onPress={() => {
                          setFontFamily(font.value);
                          setFontKey(prev => prev + 1); // Force re-render
                          setShowFontModal(false);
                        }}
                      >
                        <Text style={[
                          styles.modalItemText, 
                          { fontFamily: font.value },
                        ]}>
                          {font.name} - 示例文字
                        </Text>
                        <Text style={styles.fontInfo}>
                          {font.value} (ID: {fontKey})
                        </Text>
                        <Text style={styles.fontPreview}>
                          {text}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </Modal>

            {/* 颜色模态框 */}
            <Modal visible={showColorModal} transparent animationType="slide">
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>选择文字颜色</Text>
                    <TouchableOpacity onPress={() => setShowColorModal(false)}>
                      <Ionicons name="close" size={24} color="black" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.colorGrid}>
                    {COLORS.map((color) => (
                      <TouchableOpacity
                        key={color}
                        style={[
                          styles.colorItem,
                          { backgroundColor: color },
                          textColor === color && styles.colorItemActive,
                        ]}
                        onPress={() => {
                          setTextColor(color);
                          setShowColorModal(false);
                        }}
                      />
                    ))}
                  </View>
                </View>
              </View>
            </Modal>

            {/* 背景模态框 */}
            <Modal visible={showBackgroundModal} transparent animationType="slide">
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>选择背景</Text>
                    <TouchableOpacity onPress={() => setShowBackgroundModal(false)}>
                      <Ionicons name="close" size={24} color="black" />
                    </TouchableOpacity>
                  </View>
                  <ScrollView>
                    {BACKGROUND_PRESETS.map((bg, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.backgroundItem,
                          selectedBackground === bg && styles.modalItemActive,
                        ]}
                        onPress={() => {
                          setSelectedBackground(bg);
                          setShowBackgroundModal(false);
                        }}
                      >
                        <View style={styles.backgroundPreview}>
                          {bg.type === 'gradient' && bg.colors ? (
                            <LinearGradient
                              colors={bg.colors}
                              style={styles.backgroundPreviewBox}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 1 }}
                            />
                          ) : bg.type === 'transparent' ? (
                            <View style={[styles.backgroundPreviewBox, styles.transparentPreview]} />
                          ) : bg.type === 'solid' && bg.color ? (
                            <View
                              style={[
                                styles.backgroundPreviewBox,
                                { backgroundColor: bg.color },
                              ]}
                            />
                          ) : (
                            <View style={[styles.backgroundPreviewBox, { backgroundColor: '#FFFFFF' }]} />
                          )}
                        </View>
                        <Text style={styles.modalItemText}>{bg.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </Modal>

            {/* 图片背景模态框 */}
            <Modal visible={showPictureModal} transparent animationType="slide">
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>选择图片背景</Text>
                    <TouchableOpacity onPress={() => setShowPictureModal(false)}>
                      <Ionicons name="close" size={24} color="black" />
                    </TouchableOpacity>
                  </View>
                  
                  {/* 分类筛选 */}
                  <View style={styles.categoryFilter}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {['全部', '纹理', '抽象艺术', '文化主题', '自然', '现代设计', '其他'].map((category) => (
                        <TouchableOpacity
                          key={category}
                          style={[
                            styles.categoryButton,
                            selectedPictureCategory === category && styles.categoryButtonActive,
                          ]}
                          onPress={() => setSelectedPictureCategory(category)}
                        >
                          <Text style={[
                            styles.categoryButtonText,
                            selectedPictureCategory === category && styles.categoryButtonTextActive,
                          ]}>
                            {category}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  <ScrollView>
                    {PICTURE_BACKGROUNDS
                      .filter(bg => selectedPictureCategory === '全部' || bg.category === selectedPictureCategory)
                      .map((bg) => (
                      <TouchableOpacity
                        key={bg.id}
                        style={[
                          styles.backgroundItem,
                          selectedBackground.type === 'picture' && 
                          selectedBackground.uri === bg.uri && 
                          styles.modalItemActive,
                        ]}
                        onPress={() => {
                          setSelectedBackground({ type: 'picture', uri: bg.uri, name: bg.name });
                          setShowPictureModal(false);
                        }}
                      >
                        <View style={styles.backgroundPreview}>
                          <Image source={bg.uri} style={styles.backgroundPreviewBox} />
                        </View>
                        <View style={styles.backgroundInfo}>
                          <Text style={styles.modalItemText}>{bg.name}</Text>
                          <Text style={styles.backgroundCategory}>{bg.category}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </Modal>
          </>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'PingFang SC',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 15,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  canvasContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  canvasWrapper: {
    position: 'relative',
  },
  canvas: {
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  textContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  textTouchable: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },
  displayText: {
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  textInput: {
    flex: 1,
    width: '100%',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  transparentPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f0f0f0',
    opacity: 0.8,
  },
  pictureBackground: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  controls: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
  },
  controlSection: {
    marginBottom: 20,
  },
  controlLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 10,
    fontFamily: 'PingFang SC',
  },
  sizeControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 10,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  controlButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
    fontFamily: 'PingFang SC',
  },
  colorPreview: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
  },
  alignmentButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  alignmentButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 8,
  },
  alignmentButtonActive: {
    backgroundColor: 'white',
  },
  ratioButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  ratioButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  ratioButtonActive: {
    backgroundColor: 'white',
  },
  ratioButtonText: {
    color: 'white',
    fontWeight: '600',
    fontFamily: 'PingFang SC',
  },
  ratioButtonTextActive: {
    color: '#667eea',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalHeaderButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshButton: {
    marginRight: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'PingFang SC',
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalItemActive: {
    backgroundColor: '#e3f2fd',
  },
  modalItemText: {
    fontSize: 16,
    fontFamily: 'PingFang SC',
  },
  fontInfo: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  fontDebug: {
    fontSize: 10,
    color: '#ccc',
    marginTop: 5,
  },
  fontPreview: {
    fontSize: 14,
    color: '#555',
    marginTop: 10,
    fontFamily: 'PingFang SC',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    justifyContent: 'space-between',
  },
  colorItem: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorItemActive: {
    borderColor: '#667eea',
  },
  backgroundItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backgroundPreview: {
    marginRight: 15,
  },
  backgroundPreviewBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  transparentPreview: {
    backgroundColor: '#f0f0f0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#667eea',
  },
  loadingText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  customFontSection: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#f8f9fa',
  },
  addFontButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    marginHorizontal: 15,
  },
  addFontText: {
    marginLeft: 10,
    color: '#667eea',
    fontSize: 16,
    fontFamily: 'PingFang SC',
    fontWeight: '600',
  },
  customFontInfo: {
    marginTop: 5,
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
  },
  customFontsList: {
    marginTop: 15,
    paddingHorizontal: 15,
  },
  customFontsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    fontFamily: 'PingFang SC',
  },
  customFontItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    borderRadius: 6,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  customFontName: {
    fontSize: 15,
    color: '#333',
    fontFamily: 'PingFang SC',
    flex: 1,
  },
  removeFontButton: {
    padding: 5,
    backgroundColor: '#ffebee',
    borderRadius: 4,
  },
  categoryFilter: {
    flexDirection: 'row',
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryButtonActive: {
    backgroundColor: 'white',
    borderColor: '#667eea',
  },
  categoryButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'PingFang SC',
    fontWeight: '600',
  },
  categoryButtonTextActive: {
    color: '#667eea',
  },
  backgroundInfo: {
    flex: 1,
    marginLeft: 10,
  },
  backgroundCategory: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
});