# Text Art App

A React Native app for creating beautiful text art with customizable backgrounds, fonts, and colors.

## Features

- **Text Customization**: Font size, family, color, and alignment
- **Background Options**: Solid colors, gradients, transparent, and picture backgrounds
- **Canvas Ratios**: Multiple aspect ratios (1:1, 16:9, 4:3, 3:4)
- **Export Options**: Save to gallery and share with others
- **Chinese Font Support**: 16+ custom Chinese fonts included

## 🎨 **Custom Chinese Fonts Included**

The app comes with **16 beautiful Chinese fonts** pre-loaded:

### **Handwriting & Artistic Fonts:**
- **汉仪新蒂宝塔体** - Elegant pagoda-style font
- **Dymon手写体** - Natural handwriting style
- **新蒂剪纸体** - Paper-cut art style
- **汉仪新蒂春意体** - Spring-inspired brush style
- **字魂乌龙茶** - Tea-inspired artistic font
- **字魂白鸽天行体** - Flying dove style
- **美人的字** - Beautiful feminine style
- **阿猪泡泡体** - Cute bubble style

### **Modern & Professional Fonts:**
- **DF力王黑体** - Strong, bold sans-serif
- **包图小白体** - Clean, modern sans-serif
- **Oz焦糖体** - Sweet, rounded style
- **源柔大正宋体** - Traditional serif
- **Slidefu字体** - Contemporary design
- **汉仪白清体** - Clean, minimal style
- **汉仪彩蝶体** - Colorful butterfly style
- **思源黑体** - Adobe's professional font

## ➕ **Custom Font Upload Feature**

### **Add Your Own Fonts:**
1. **Tap the "+" icon** in the font selection modal
2. **Select TTF or OTF files** from your device
3. **Fonts are automatically loaded** and added to your collection
4. **Custom fonts persist** between app sessions

### **Supported Formats:**
- **TTF** (TrueType Font)
- **OTF** (OpenType Font)
- **Font files** are copied to app cache for performance

### **Font Management:**
- **View all custom fonts** in the font modal
- **Remove unwanted fonts** with the trash icon
- **Automatic persistence** - fonts saved between app launches
- **Real-time preview** of custom fonts

### **How It Works:**
1. **Document Picker**: Uses Expo Document Picker for file selection
2. **Font Loading**: Automatically loads fonts with expo-font
3. **Persistence**: Saves font list using AsyncStorage
4. **Performance**: Fonts are cached for fast loading

## Adding Picture Backgrounds

The app now includes **45 beautiful custom background images** from your collection, organized into categories:

### **Texture & Grunge Backgrounds (16 images):**
- White textures, concrete walls, grunge effects
- Vintage and retro textures
- Film grain and paper textures
- Fabric and material textures

### **Abstract & Artistic Backgrounds (11 images):**
- Watercolor paintings and abstract art
- Colorful gradients and patterns
- Modern geometric designs
- Artistic brush strokes and effects

### **Cultural & Themed Backgrounds (5 images):**
- Japanese wave patterns with red and gold
- Korean traditional patterns
- Chinese-inspired designs
- Vintage koi fish decorations

### **Nature & Organic Backgrounds (3 images):**
- Blue sky with white clouds
- Holi color powder patterns
- Abstract mountain designs
- Natural texture backgrounds

### **Modern & Design Backgrounds (3 images):**
- Elegant monochrome circles
- Rose gold art patterns
- Contemporary abstract lines
- Professional design textures

### **Other Backgrounds (7 images):**
- Pixel art brick walls
- Various colored backgrounds
- Paper textures and frames

## Background Organization Features

- **Category Filtering**: Filter backgrounds by category (纹理, 抽象艺术, 文化主题, 自然, 现代设计, 其他)
- **Horizontal Category Tabs**: Easy navigation between background types
- **Visual Previews**: Thumbnail previews of all backgrounds
- **Category Labels**: Each background shows its category
- **Smart Filtering**: "全部" shows all backgrounds, individual categories show filtered results

## Current Picture Backgrounds

- **45 High-Quality Images** in JPG, PNG, and AVIF formats
- **Professional Textures** for commercial use
- **Cultural Patterns** from various traditions
- **Abstract Designs** for creative projects
- **Vintage & Retro** styles for classic looks
- **Modern & Minimal** designs for contemporary projects

## Development

```bash
# Install dependencies
npm install

# Install expo-font for custom fonts
npx expo install expo-font

# Run the app
npm start
```

## Dependencies

- React Native
- Expo
- Linear Gradient
- View Shot
- Media Library
- File System
- Haptics
- Vector Icons
- **Expo Font** (for custom font loading)

## Font Loading

The app automatically loads all custom fonts on startup. You'll see a "正在加载字体..." (Loading fonts...) message while fonts are being loaded. Once complete, all 16 Chinese fonts will be available for use.

## Adding More Custom Fonts

To add additional fonts:

1. **Place font files** in `assets/fonts/` folder
2. **Update font loading** in `App.tsx`:

```typescript
await Font.loadAsync({
  'NewFontName': require('./assets/fonts/NewFont.ttf'),
});
```

3. **Add to FONTS array**:

```typescript
const FONTS = [
  // ... existing fonts
  { name: '新字体名称', value: 'NewFontName' },
];
```
