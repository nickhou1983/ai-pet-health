from __future__ import annotations

import json
from typing import Any

from app.models import Consultation, Message


class PromptService:
    def build_chat_messages(self, consultation: Consultation, messages: list[Message]) -> list[dict[str, str]]:
        pet_info = self._parse_pet_info(consultation.pet_info)
        history = messages[-20:]
        prompt = self._build_system_prompt(pet_info)

        payload: list[dict[str, str]] = [{"role": "system", "content": prompt}]
        for message in history:
            payload.append({"role": message.role.value, "content": message.content})
        return payload

    def build_report_messages(self, consultation: Consultation, messages: list[Message]) -> list[dict[str, str]]:
        pet_info = self._parse_pet_info(consultation.pet_info)
        conversation = "\n".join(f"{message.role.value}: {message.content}" for message in messages[-20:])
        pet_context = self._format_pet_info(pet_info)
        prompt = (
            "你是一名专业宠物健康顾问。请基于以下问诊对话输出一个 JSON 对象，字段必须为："
            '`report`（字符串，总结宠物情况、观察重点和建议），'
            '`urgency_level`（none/low/medium/high/critical 之一），'
            '`recommendations`（字符串数组，给出 3-5 条简洁建议）。'
            "如果情况紧急，要明确说明立即就医。不要输出 JSON 以外的内容。\n\n"
            f"宠物信息：\n{pet_context}\n\n"
            f"对话内容：\n{conversation}"
        )
        return [{"role": "system", "content": prompt}]

    def _build_system_prompt(self, pet_info: dict[str, Any] | None) -> str:
        pet_context = self._format_pet_info(pet_info)
        return (
            "你是一名专业、谨慎、富有同理心的宠物健康咨询助手。"
            "你的目标是帮助主人梳理宠物症状、判断紧急程度，并提供下一步建议。"
            "你不能替代线下兽医诊疗，涉及危急情况时必须明确建议尽快或立即就医。\n\n"
            "回答要求：\n"
            "1. 优先用中文简洁回答，必要时分点说明。\n"
            "2. 多轮问诊时主动追问症状持续时间、发生频率、食欲精神、排便排尿、是否有呕吐腹泻、既往病史、近期环境变化或摄入异常。\n"
            "3. 对可能的风险做分级判断（none/low/medium/high/critical），但不要机械输出级别，除非用户直接询问。\n"
            "4. 提供家庭观察建议时要明确可执行，并提醒何时需要线下就诊。\n"
            "5. 不要编造检查结果、处方或确定性诊断。\n\n"
            f"当前宠物信息：\n{pet_context}"
        )

    def _format_pet_info(self, pet_info: dict[str, Any] | None) -> str:
        if not pet_info:
            return "未提供"

        lines = []
        field_labels = {
            "name": "姓名",
            "breed": "品种",
            "age": "年龄",
            "weight": "体重",
            "gender": "性别",
            "species": "物种",
        }
        for key, value in pet_info.items():
            if value in (None, "", []):
                continue
            label = field_labels.get(key, key)
            lines.append(f"- {label}: {value}")
        return "\n".join(lines) if lines else "未提供"

    def _parse_pet_info(self, pet_info: str | None) -> dict[str, Any] | None:
        if not pet_info:
            return None
        try:
            parsed = json.loads(pet_info)
            return parsed if isinstance(parsed, dict) else None
        except json.JSONDecodeError:
            return None


prompt_service = PromptService()
