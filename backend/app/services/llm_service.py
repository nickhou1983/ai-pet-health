from __future__ import annotations

from collections.abc import AsyncGenerator

from openai import AsyncOpenAI

from app.core.config import settings


class LLMService:
    def __init__(self) -> None:
        self.client = AsyncOpenAI(
            api_key=settings.OPENAI_API_KEY,
            base_url=settings.OPENAI_BASE_URL,
        )

    async def chat_completion_stream(self, messages: list[dict[str, str]]) -> AsyncGenerator[str, None]:
        """Stream chat completion tokens."""
        stream = await self.client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=messages,
            max_tokens=settings.OPENAI_MAX_TOKENS,
            temperature=settings.OPENAI_TEMPERATURE,
            stream=True,
        )
        async for chunk in stream:
            if chunk.choices and chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content

    async def chat_completion(self, messages: list[dict[str, str]]) -> str:
        """Non-streaming chat completion."""
        response = await self.client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=messages,
            max_tokens=settings.OPENAI_MAX_TOKENS,
            temperature=settings.OPENAI_TEMPERATURE,
        )
        return response.choices[0].message.content or ""


llm_service = LLMService()
