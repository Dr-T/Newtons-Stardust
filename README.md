<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 产品介绍

完整产品介绍详见：[产品介绍](产品介绍.md)

## **"Newton's Stardust" (牛顿的星尘)**

沉浸式物理学习应用——通过**费曼学习法**（通过教授他人来学习）掌握物理知识（特别是万有引力与开普勒定律）的交互式环境。

### 1. 核心功能 (Core Features)

- **沉浸式 3D 宇宙场景 (Particle View):**

    - **实时太阳系模拟：** 基于开普勒方程（Kepler's Equation）通过牛顿迭代法精确计算行星轨道（椭圆），模拟真实的行星运动。

    **音频可视化：** 整个宇宙场景（行星大小、轨道光辉、背景星尘）会随着用户的语音音量实时律动（Audio Reactive），创造出“声音控制宇宙”的唯美体验。

    **自定义控制：** 用户可以调整宇宙膨胀率、时间流速、星尘大小、引力半径等参数。

- **多角色 AI 导师 (AI Personas):**

    - 应用内置了三位性格迥异的 AI 角色，迫使学生从不同角度解释物理原理：

        1. **中世纪观星者 (The Stargazer):** 怀疑论者，只相信圆周运动，需要学生向他解释“为什么轨道是椭圆”。

        2. **牛顿崇拜者 (The Newtonian):** 逻辑狂人，要求学生用万有引力推导开普勒定律的本质，不接受死记硬背。

        3. **航天指挥官 (The Commander):** 务实派，关注宇宙速度、变轨等实际航天应用。

- **实时语音交互 (Gemini Live Interaction):**

    - 利用 Gemini Live API 实现低延迟的语音对话。

    - 支持**全双工对话**：用户可以说、打断，AI 会以自然的语音回应。

    - 强制中文输出：系统指令锁定了简体中文模式，确保沉浸式的中文教学体验。

- **知识结晶与评估系统 (Memory Gallery):**

    - **智能评估：** 会话结束后，AI 会根据对话内容自动生成 JSON 格式的评估报告，从“公式理解”、“逻辑严密性”、“应用能力”三个维度打分。

    - **记忆卡片：** 生成带有诗意标题和总结的“知识记忆”卡片。

    - **艾宾浩斯遗忘曲线可视化：** 每个记忆卡片包含一个动态 SVG 图表，显示当前知识点的记忆保留率，提醒用户复习。

### 2. 产品亮点 (Highlights)

- **教育理念创新 (Feynman Technique):**

    - 不同于传统的“AI 教学生”，该应用让“学生教 AI”。通过让用户向不同角色（怀疑者、逻辑狂、实干家）解释概念，检验用户是否真正掌握了知识。

- **极致的视听体验 (Cinematic UI/UX):**

    - **视觉风格：** 采用深色宇宙主题，结合玻璃拟态 (Glassmorphism) UI，使用衬线字体 (Cormorant Garamond) 营造史诗感和学术感。

    - **着色器特效：** 使用自定义 GLSL Shader (StardustShader) 渲染背景星尘，实现高性能的粒子流动效果。

- **前沿技术栈 (Tech Stack):**

    - **Gemini Multimodal Live API:** 实现了视频/音频流的实时处理，而非传统的“录音-转文字-LLM-转语音”的慢速链路。

    - **React Three Fiber:** 在 React 中构建高性能 WebGL 场景。

    - **Web Audio API:** 本地实时分析音频频谱，驱动视觉特效，无需上传音频数据即可实现可视化。

- **情感化设计:**

    - 不仅是冷冰冰的问答，还有背景音乐、会话时长统计、以及带有情感色彩的 AI 角色设定，让学习过程更像是一场星际探险。

总结来说，这是一个**将硬核物理公式转化为艺术体验**的教育应用，它不仅测试你的物理知识，更通过极具美感的交互让你爱上思考。



# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1XZ4OPv6zjZOUX6PDkXzJAW1qzaRZ1bRz
