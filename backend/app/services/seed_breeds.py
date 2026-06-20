"""Seed common dog and cat breeds into the database."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.breed import Breed

BREEDS_DATA = [
    # Dogs
    {"species": "dog", "name": "Labrador Retriever", "name_cn": "拉布拉多犬", "size": "large", "life_expectancy": "10-14 years", "common_diseases": ["髋关节发育不良", "肥胖", "眼疾"], "description": "性格温和、聪明，适合家庭饲养"},
    {"species": "dog", "name": "Golden Retriever", "name_cn": "金毛寻回犬", "size": "large", "life_expectancy": "10-12 years", "common_diseases": ["髋关节发育不良", "皮肤病", "心脏病"], "description": "友善、可靠、忠诚的家庭犬"},
    {"species": "dog", "name": "German Shepherd", "name_cn": "德国牧羊犬", "size": "large", "life_expectancy": "9-13 years", "common_diseases": ["髋关节发育不良", "消化问题", "退行性脊髓病"], "description": "聪明、勇敢，常用于工作犬"},
    {"species": "dog", "name": "Poodle", "name_cn": "贵宾犬", "size": "medium", "life_expectancy": "12-15 years", "common_diseases": ["膝盖脱臼", "眼疾", "皮肤病"], "description": "聪明、活泼，低过敏性犬种"},
    {"species": "dog", "name": "French Bulldog", "name_cn": "法国斗牛犬", "size": "small", "life_expectancy": "10-12 years", "common_diseases": ["呼吸困难", "皮肤褶皱感染", "脊椎问题"], "description": "体型小巧、性格温顺的伴侣犬"},
    {"species": "dog", "name": "Corgi", "name_cn": "柯基犬", "size": "small", "life_expectancy": "12-15 years", "common_diseases": ["椎间盘疾病", "肥胖", "髋关节发育不良"], "description": "短腿长身，活泼聪明"},
    {"species": "dog", "name": "Husky", "name_cn": "哈士奇", "size": "large", "life_expectancy": "12-15 years", "common_diseases": ["眼疾", "髋关节发育不良", "皮肤病"], "description": "精力充沛、独立，适合活跃家庭"},
    {"species": "dog", "name": "Shiba Inu", "name_cn": "柴犬", "size": "medium", "life_expectancy": "12-15 years", "common_diseases": ["过敏性皮炎", "膝盖脱臼", "眼疾"], "description": "忠诚、独立，日本原产犬种"},
    {"species": "dog", "name": "Border Collie", "name_cn": "边境牧羊犬", "size": "medium", "life_expectancy": "12-15 years", "common_diseases": ["髋关节发育不良", "癫痫", "眼疾"], "description": "最聪明的犬种，精力旺盛"},
    {"species": "dog", "name": "Samoyed", "name_cn": "萨摩耶犬", "size": "large", "life_expectancy": "12-14 years", "common_diseases": ["髋关节发育不良", "糖尿病", "皮肤病"], "description": "白色蓬松毛发，性格友善"},
    {"species": "dog", "name": "Bichon Frise", "name_cn": "比熊犬", "size": "small", "life_expectancy": "12-15 years", "common_diseases": ["膝盖脱臼", "过敏", "牙齿问题"], "description": "白色卷毛，性格开朗"},
    {"species": "dog", "name": "Pomeranian", "name_cn": "博美犬", "size": "small", "life_expectancy": "12-16 years", "common_diseases": ["膝盖脱臼", "气管塌陷", "牙齿问题"], "description": "体型娇小、活泼好动"},
    {"species": "dog", "name": "Dachshund", "name_cn": "腊肠犬", "size": "small", "life_expectancy": "12-16 years", "common_diseases": ["椎间盘疾病", "肥胖", "牙齿问题"], "description": "长身短腿，性格勇敢"},
    {"species": "dog", "name": "Beagle", "name_cn": "比格犬", "size": "medium", "life_expectancy": "10-15 years", "common_diseases": ["耳朵感染", "肥胖", "癫痫"], "description": "友善活泼，嗅觉灵敏"},
    {"species": "dog", "name": "Maltese", "name_cn": "马尔济斯犬", "size": "small", "life_expectancy": "12-15 years", "common_diseases": ["牙齿问题", "膝盖脱臼", "泪痕"], "description": "白色长毛，温柔亲人"},
    # Cats
    {"species": "cat", "name": "British Shorthair", "name_cn": "英国短毛猫", "size": "medium", "life_expectancy": "12-20 years", "common_diseases": ["肥厚型心肌病", "肥胖", "牙齿问题"], "description": "圆脸圆眼，性格温顺"},
    {"species": "cat", "name": "Ragdoll", "name_cn": "布偶猫", "size": "large", "life_expectancy": "12-17 years", "common_diseases": ["肥厚型心肌病", "膀胱结石", "毛球症"], "description": "性格温顺、粘人，被抱起时全身放松"},
    {"species": "cat", "name": "Persian", "name_cn": "波斯猫", "size": "medium", "life_expectancy": "12-17 years", "common_diseases": ["多囊肾病", "呼吸问题", "眼疾"], "description": "长毛、扁脸，性格安静"},
    {"species": "cat", "name": "Maine Coon", "name_cn": "缅因猫", "size": "large", "life_expectancy": "12-15 years", "common_diseases": ["肥厚型心肌病", "髋关节发育不良", "脊肌萎缩"], "description": "体型最大的家猫品种之一"},
    {"species": "cat", "name": "American Shorthair", "name_cn": "美国短毛猫", "size": "medium", "life_expectancy": "15-20 years", "common_diseases": ["肥厚型心肌病", "肥胖", "牙齿问题"], "description": "适应性强、性格温和"},
    {"species": "cat", "name": "Siamese", "name_cn": "暹罗猫", "size": "medium", "life_expectancy": "15-20 years", "common_diseases": ["淀粉样变", "哮喘", "眼疾"], "description": "蓝眼重点色，性格活泼好动"},
    {"species": "cat", "name": "Scottish Fold", "name_cn": "苏格兰折耳猫", "size": "medium", "life_expectancy": "11-14 years", "common_diseases": ["骨软骨发育不良", "关节问题", "心脏病"], "description": "折耳特征，性格安静亲人"},
    {"species": "cat", "name": "Exotic Shorthair", "name_cn": "异国短毛猫", "size": "medium", "life_expectancy": "12-15 years", "common_diseases": ["多囊肾病", "呼吸问题", "泪痕"], "description": "短毛版波斯猫，圆润可爱"},
    {"species": "cat", "name": "Russian Blue", "name_cn": "俄罗斯蓝猫", "size": "medium", "life_expectancy": "15-20 years", "common_diseases": ["膀胱结石", "肥胖", "焦虑症"], "description": "银蓝色短毛，性格安静害羞"},
    {"species": "cat", "name": "Munchkin", "name_cn": "曼基康猫", "size": "small", "life_expectancy": "12-15 years", "common_diseases": ["脊椎问题", "关节问题", "肥胖"], "description": "短腿猫，活泼好奇"},
]


async def seed_breeds(db: AsyncSession) -> int:
    """Seed breed data. Returns the number of breeds inserted."""
    result = await db.execute(select(Breed).limit(1))
    if result.scalar_one_or_none():
        return 0  # Already seeded

    count = 0
    for data in BREEDS_DATA:
        breed = Breed(**data)
        db.add(breed)
        count += 1

    await db.flush()
    return count
