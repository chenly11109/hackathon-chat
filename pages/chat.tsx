import { Chat, IMessage } from "@/components/chat";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function Home() {

  const messages: IMessage[] = [{
    type: "text",
    role: "user",
    content: "hello",
    status: "receiving",
  }, {
    type: "markdown",
    role: "assistant",
    content: `
### 项目Timeline

#### 一、项目背景（Background）
- 客户信息：天猫
- 项目背景：杂志封面设计，包含3D主视觉和平面合成海报
- Key message（文案主题）：“The Nature for Nature for City”
- 目标群体：需最终确认
- 主推产品&卖点传播渠道：需最终确认
- 要什么不要什么？需最终确认

#### 二、项目目标（Objective）
为什么要做？
- 设计现代且极简风格的杂志封面，突出自然元素，吸引目标读者。

#### 三、核心工作/任务（Key Task）
遇到了什么挑战，要解决什么任务
- 挑战在于如何在现代极简设计中凸显自然元素的丰富与多样。

#### 四、产出内容（Deliverables）
交付SKU：
- 3D主视觉1张
- 平面合成海报3张

交付文件尺寸、规格、源文件格式等交付数量：
- 需最终确认

#### 五、提交时间（Deadline）
- 最终交付时间：需最终确认
- 过程交付关键节点：
  - 初稿提交：需最终确认
  - 客户反馈：需最终确认
  - 终稿提交：需最终确认

#### 六、预算范围（Budget）
- 需最终确认

#### 七、案例参考
- 杂志封面设计案例：
  - 封面主要是白色背景，黑色文字。标题使用大号粗体字，位于封面顶部。标题下方有一个小花园的插图，包含多种植物和花卉，植物排列成圆形图案，背景为浅蓝色，整体设计现代且极简。
  - 右侧有两个相同花园的小插图，插图详细且真实，包含多种颜色和纹理。
- 加湿器产品图片案例：
  - 图片展示一个白色的电子设备，看起来像是加湿器，放置在一个圆形平台上。设备呈圆柱形，设计简约现代。背景为浅绿色，有波浪状图案，给人一种海洋的感觉。文字为中文，翻译为“加湿器”。整体美学有未来感和科技感。

#### 八、客户侧提供的素材
- 需最终确认

---

## 推荐创意方

### SKU1: 3D主视觉

#### 1. 昵称: 小宇宙设计
- 基本信息: 小宇宙设计工作室，10人内公司，地址在上海市静安区南京西路1601号。
- 擅长SKU: 
  - 3D主视觉-中等:成交7次,平均7000元/张
- 合作次数: 总合作次数为50次，近一年合作次数为30次，近半年合作次数为15次。
- top网址: [小宇宙设计](https://top.tezign.com/#/app/designerRepertory/list/50001?_sn=xa53dqbp.senghv.senhmo_&tabKey=1)
- 理由: 在3D主视觉方面有丰富的经验，客户对其作品的创意和质量给予了高度评价。

#### 2. 昵称: 晴空设计
- 基本信息: 晴空设计公司，10人内公司，地址在北京市朝阳区大望路SOHO现代城。
- 擅长SKU: 
  - 3D主视觉-中等:成交10次,平均6500元/张
- 合作次数: 总合作次数为80次，近一年合作次数为35次，近半年合作次数为20次。
- top网址: [晴空设计](https://top.tezign.com/#/app/designerRepertory/list/50002?_sn=xa53dqbp.senghv.senhmo_&tabKey=1)
- 理由: 出品质量高，特别是在3D主视觉方面表现出色，客户对其创意和质量给予了高度评价。

#### 3. 昵称: 星河创意
- 基本信息: 星河创意工作室，个人，地址在深圳市南山区科技园。
- 擅长SKU: 
  - 3D主视觉-中等:成交8次,平均6800元/张
- 合作次数: 总合作次数为60次，近一年合作次数为25次，近半年合作次数为10次。
- top网址: [星河创意](https://top.tezign.com/#/app/designerRepertory/list/50003?_sn=xa53dqbp.senghv.senhmo_&tabKey=1)
- 理由: 在3D主视觉方面表现出色，客户对其作品的创意和质量给予了高度评价。

### SKU2: 平面合成海报

#### 1. 昵称: 创意工坊
- 基本信息: 创意工坊，10人内公司，地址在杭州市滨江区江南大道。
- 擅长SKU: 
  - 平面合成海报-中等:成交15次,平均4500元/张
- 合作次数: 总合作次数为100次，近一年合作次数为50次，近半年合作次数为20次。
- top网址: [创意工坊](https://top.tezign.com/#/app/designerRepertory/list/50004?_sn=xa53dqbp.senghv.senhmo_&tabKey=1)
- 理由: 出品质量高，特别是在平面合成海报方面表现出色，客户对其创意和质量给予了高度评价。

#### 2. 昵称: 灵感设计
- 基本信息: 灵感设计公司，10人内公司，地址在上海市浦东新区陆家嘴。
- 擅长SKU: 
  - 平面合成海报-中等:成交12次,平均5000元/张
- 合作次数: 总合作次数为90次，近一年合作次数为40次，近半年合作次数为15次。
- top网址: [灵感设计](https://top.tezign.com/#/app/designerRepertory/list/50005?_sn=xa53dqbp.senghv.senhmo_&tabKey=1)
- 理由: 在平面合成海报方面有丰富经验，客户对其作品的创意和质量给予了高度评价。

#### 3. 昵称: 视觉工厂
- 基本信息: 视觉工厂，个人，地址在成都市高新区。
- 擅长SKU: 
  - 平面合成海报-中等:成交10次,平均4800元/张
- 合作次数: 总合作次数为80次，近一年合作次数为30次，近半年合作次数为12次。
- top网址: [视觉工厂](https://top.tezign.com/#/app/designerRepertory/list/50006?_sn=xa53dqbp.senghv.senhmo_&tabKey=1)
- 理由: 出品质量较高，特别是在平面合成海报设计方面表现出色，客户对其作品的质量和配合度给予了高度评价。

---

## Timeline

### 一、项目启动会
- 时间：需最终确认
- 参与者：客户方、创意方项目负责人、设计师
- 主要内容：
  - 确认项目背景、目标和关键任务
  - 明确交付物要求及时间节点
  - 确认沟通渠道及反馈流程

### 二、初稿阶段
- 时间：需最终确认
- 主要内容：
  - 3D主视觉初稿设计
  - 平面合成海报初稿设计
- 提交初稿时间：需最终确认
- 客户反馈时间：需最终确认

### 三、修改及终稿阶段
- 时间：需最终确认
- 主要内容：
  - 根据客户反馈进行修改
  - 提交终稿
- 提交终稿时间：需最终确认
- 客户最终确认时间：需最终确认

### 四、项目总结会
- 时间：需最终确认
- 主要内容：
  - 项目回顾与总结
  - 评估项目成果
  - 收集客户反馈

---

## 参考链接

插画海报类: https://tezign.feishu.cn/sheets/shtcnIUvwel0aPGCz2IVk4m3mlb?from=from_copylink
3D设计大类: https://tezign.feishu.cn/sheets/shtcn3Ss8k0EG5N7wB3zcWRqaAf?from=from_copylink    
    `,
    status: "finished",
  }]

  return (
    <TooltipProvider>
      <Chat messages={messages} stopReceivingMessage={() => { }} />
      <Toaster />
    </TooltipProvider>
  );
}
