# AI Pet Health

基于 AI 的宠物健康管理平台，帮助宠物主人更好地了解和管理宠物健康。

## 技术栈

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Python + FastAPI + SQLAlchemy (async)
- **Database**: PostgreSQL
- **AI**: LLM-based health analysis
- **DevOps**: Docker Compose

## 项目结构

```
ai-pet-health/
├── frontend/                # React 前端应用
│   ├── src/
│   │   ├── api/            # HTTP 请求封装
│   │   ├── components/     # 公共组件
│   │   ├── pages/          # 页面组件
│   │   ├── stores/         # Zustand 状态管理
│   │   └── styles/         # 全局样式
│   └── Dockerfile
├── backend/                 # Python FastAPI 后端
│   ├── app/
│   │   ├── api/            # 路由层
│   │   ├── core/           # 核心配置
│   │   ├── db/             # 数据库连接
│   │   ├── models/         # 数据模型
│   │   ├── schemas/        # Pydantic schemas
│   │   └── services/       # 业务逻辑层
│   ├── alembic/            # 数据库迁移
│   └── Dockerfile
├── docs/                    # 项目文档
├── docker-compose.yml       # 开发环境编排
├── Makefile                 # 快捷命令
└── .env.example             # 环境变量模板
```

## 快速开始

### 使用 Docker（推荐）

```bash
# 一键启动所有服务
make up

# 查看日志
make logs

# 停止所有服务
make down
```

启动后访问：
- 前端: http://localhost:5173
- 后端 API: http://localhost:8000
- API 文档: http://localhost:8000/docs

### 本地开发

#### 后端
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### 前端
```bash
cd frontend
npm install
npm run dev
```

### 数据库迁移

```bash
# 执行迁移
make migrate

# 创建新迁移
make migrate-create msg="add users table"
```

## 常用命令

运行 `make help` 查看所有可用命令。

| 命令 | 描述 |
|------|------|
| `make up` | 启动所有服务 |
| `make down` | 停止所有服务 |
| `make build` | 重新构建容器 |
| `make logs` | 查看日志 |
| `make migrate` | 执行数据库迁移 |
| `make shell-backend` | 进入后端容器 |
| `make shell-db` | 进入数据库 |

## 环境变量

复制 `.env.example` 创建 `.env` 文件：

```bash
cp .env.example .env
```

## License

MIT
