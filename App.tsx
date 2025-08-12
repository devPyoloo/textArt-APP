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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// 中文字体预设
const FONTS = [
  { name: '系统默认', value: 'System' },
  { name: '苹方', value: 'PingFang SC' },
  { name: '思源宋体', value: 'Source Han Serif SC' },
  { name: '思源黑体', value: 'Source Han Sans SC' },
  { name: '华文楷体', value: 'STKaiti' },
  { name: '华文宋体', value: 'STSong' },
  { name: '华文黑体', value: 'STHeiti' },
  { name: '华文仿宋', value: 'STFangsong' },
];

// 预设颜色
const COLORS = [
  '#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
  '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB', '#A52A2A',
  '#808080', '#008000', '#000080', '#800000', '#808000', '#008080',
];

// 背景预设
const BACKGROUND_PRESETS = [
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

// 文字对齐选项
const TEXT_ALIGNMENTS = ['left', 'center', 'right', 'justify'] as const;

export default function App() {
  const [text, setText] = useState('您的文字');
  const [fontSize, setFontSize] = useState(24);
  const [fontFamily, setFontFamily] = useState('System');
  const [textColor, setTextColor] = useState('#000000');
  const [selectedBackground, setSelectedBackground] = useState(BACKGROUND_PRESETS[0]);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right' | 'justify'>('center');
  const [showFontModal, setShowFontModal] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);
  const [showBackgroundModal, setShowBackgroundModal] = useState(false);
  const [isEditingText, setIsEditingText] = useState(false);
  const [canvasRatio, setCanvasRatio] = useState('1:1'); // 1:1, 16:9, 4:3, 3:4
  
  const viewShotRef = useRef<ViewShot>(null);

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
  }, []);

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
    } else {
      return (
        <View style={[styles.canvas, style, { backgroundColor: selectedBackground.color }]} />
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradient}>
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
                      style={[
                        styles.textInput,
                        {
                          fontSize,
                          fontFamily,
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
                        style={[
                          styles.displayText,
                          {
                            fontSize,
                            fontFamily,
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
              <Text style={styles.controlButtonText}>字体: {FONTS.find(f => f.value === fontFamily)?.name || fontFamily}</Text>
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
                          ? 'text-align-left'
                          : alignment === 'center'
                          ? 'text-align-center'
                          : alignment === 'right'
                          ? 'text-align-right'
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
                <TouchableOpacity onPress={() => setShowFontModal(false)}>
                  <Ionicons name="close" size={24} color="black" />
                </TouchableOpacity>
              </View>
              <ScrollView>
                {FONTS.map((font) => (
                  <TouchableOpacity
                    key={font.value}
                    style={[
                      styles.modalItem,
                      fontFamily === font.value && styles.modalItemActive,
                    ]}
                    onPress={() => {
                      setFontFamily(font.value);
                      setShowFontModal(false);
                    }}
                  >
                    <Text style={[styles.modalItemText, { fontFamily: font.value }]}>
                      {font.name}
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
                      ) : (
                        <View
                          style={[
                            styles.backgroundPreviewBox,
                            { backgroundColor: bg.color },
                          ]}
                        />
                      )}
                    </View>
                    <Text style={styles.modalItemText}>{bg.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
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
});