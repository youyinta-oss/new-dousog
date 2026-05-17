# RandomAvatarApp - 构建和使用说明

## 项目简介

这是一个使用随机头像 API 的 Android 应用，使用 Jetpack Compose 构建，Kotlin 开发。

## 功能特性

- 显示随机头像
- 一键获取新头像
- Material Design 3 界面
- 优雅的加载和错误状态管理

## 技术栈

- **语言: Kotlin
- **UI**: Jetpack Compose
- **图片加载: Coil
- **网络请求: Retrofit + OkHttp
- **最低 SDK 版本: Android 7.0 (API 24)
- **目标 SDK 版本: Android 14 (API 34)

## 在 Android Studio 中构建项目

### 1. 导入项目

1. 打开 Android Studio
2. 选择 **File** → **Open**
3. 导航到 `RandomAvatarApp` 文件夹
4. 选择该文件夹并打开项目

### 2. 等待同步 Gradle

等待 Gradle 同步完成，可能需要下载依赖。

如果网络问题解决方案:
- 如果网络连接缓慢，配置国内镜像源（已在 `build.gradle.kts` 和 `settings.gradle.kts` 中配置好）
- 或者配置 Android Studio 代理

### 3. 构建 APK

#### Debug APK 方法 1 - 使用菜单:

1. 菜单栏选择 **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. 构建完成后，点击通知中的 **locate** 找到 APK 文件

#### Debug APK 方法 2 - 使用命令行:

在项目根目录下运行：
```bash
./gradlew assembleDebug
```
APK 文件位置: `app/build/outputs/apk/debug/app-debug.apk

### 4. 安装到设备

1. 连接 Android 设备（开启 USB 调试)
2. 在 Android Studio 点击运行按钮
3. 或者使用命令行:
```bash
./gradlew installDebug
```

## 项目结构说明

```
RandomAvatarApp/
├── app/
│   ├── src/main/
│   │   ├── java/com/example/randomavatarapp/
│   │   │   ├── MainActivity.kt                    # 主界面和逻辑
│   │   │   ├── network/
│   │   │   │   ├── AvatarApiService.kt            # API 服务接口
│   │   │   │   └── RetrofitClient.kt              # Retrofit 配置
│   │   │   └── ui/theme/
│   │   │       ├── Color.kt
│   │   │       ├── Theme.kt
│   │   │       └── Type.kt
│   │   ├── res/
│   │   │   ├── values/
│   │   │   │   ├── strings.xml
│   │   │   │   └── themes.xml
│   │   │   └── xml/
│   │   └── AndroidManifest.xml
│   ├── build.gradle.kts
│   └── proguard-rules.pro
├── gradle/wrapper/
├── build.gradle.kts
├── gradle.properties
├── settings.gradle.kts
└── local.properties (自动生成)
```

## 主要文件说明

| 文件 | 说明 |
| ---- | ---- |
| MainActivity.kt | 主要的界面和应用逻辑，包含用户界面和头像加载功能 |
| AvatarApiService.kt | 定义 API 接口定义 |
| RetrofitClient.kt | Retrofit 和 OkHttp 配置 |
| build.gradle.kts (app) | 应用级 Gradle 配置，包含所有依赖 |
| build.gradle.kts (根) | 项目级 Gradle 配置 |

## 自定义说明

当前项目已经配置好了阿里云 Maven 镜像源，解决网络问题：
- build.gradle.kts (根目录) 包含了国内镜像配置

## 提示

如果仍然遇到网络问题，可在项目根目录下创建 `gradle.properties` 添加:
```properties
systemProp.http.proxyHost=你的代理地址
systemProp.http.proxyPort=端口号
systemProp.https.proxyHost=你的代理地址
systemProp.https.proxyPort=端口号
```

## 运行应用

1. 确保你的设备或模拟器已连接
2. 在 Android Studio 中点击运行
3. 或者安装好后，点击 "获取新头像" 按钮，就能看到新的随机头像！

享受你的应用吧！
# new-dousog