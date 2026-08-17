#!/usr/bin/env python3
"""迟灯杂货铺本地服务器；额外允许 AI 实验室发布单个策略配置文件。"""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import json
import os
import tempfile

ROOT = Path(__file__).resolve().parent
POLICY_FILE = ROOT / "ai-policy-defaults.js"
ALLOWED_MODES = {"lean", "staff", "storm", "story", "free"}
NUMBER_KEYS = {
    "openCoverage", "crisisCoverage", "hireCoinBuffer", "hireWeeks",
    "payrollReserveWeeks", "staffTarget", "hireMinDeals", "hireCreditFloor",
    "hireCrisisLimit", "dismissMorale", "repairNormal", "repairCrisis",
    "recruitDecorBonus",
}


def load_policies():
    text = POLICY_FILE.read_text("utf-8")
    payload = text.split("=", 1)[1].rsplit(";", 1)[0]
    return json.loads(payload)


def validate_policy(value):
    if not isinstance(value, dict) or not isinstance(value.get("name"), str):
        raise ValueError("策略名称或结构无效")
    clean = {"name": value["name"][:80]}
    for key in NUMBER_KEYS:
        if key in value:
            number = value[key]
            if not isinstance(number, (int, float)) or isinstance(number, bool):
                raise ValueError(f"{key} 必须是数字")
            clean[key] = number
    return clean


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def send_json(self, status, value):
        data = json.dumps(value, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        if self.path == "/__ai-policy/status":
            self.send_json(200, {"available": True, "publishes": True})
            return
        super().do_GET()

    def do_POST(self):
        if self.path != "/__ai-policy/publish":
            self.send_error(404)
            return
        try:
            origin = self.headers.get("Origin", "")
            if origin and not origin.startswith(("http://localhost:", "http://127.0.0.1:")):
                raise ValueError("只接受本地游戏页面发起的发布请求")
            length = int(self.headers.get("Content-Length", "0"))
            if length <= 0 or length > 20000:
                raise ValueError("请求大小无效")
            request = json.loads(self.rfile.read(length))
            mode = request.get("mode")
            if mode not in ALLOWED_MODES:
                raise ValueError("未知游戏模式")
            policies = load_policies()
            policies[mode] = validate_policy(request.get("policy"))
            source = "/* AI 实验室发布的线上默认策略。此文件可由 local_server.py 安全更新。 */\n"
            source += "window.LATE_LANTERN_PUBLISHED_AI_POLICIES="
            source += json.dumps(policies, ensure_ascii=False, separators=(",", ":")) + ";\n"
            with tempfile.NamedTemporaryFile("w", encoding="utf-8", dir=ROOT, delete=False) as handle:
                handle.write(source)
                temporary = Path(handle.name)
            unchanged = POLICY_FILE.exists() and POLICY_FILE.read_text("utf-8") == source
            os.replace(temporary, POLICY_FILE)
            self.send_json(200, {
                "ok": True,
                "unchanged": unchanged,
                "file": POLICY_FILE.name,
                "message": "策略文件已更新，请在 Git 中检查后自行提交与推送",
            })
        except Exception as error:
            self.send_json(500, {"ok": False, "error": str(error)})


if __name__ == "__main__":
    print("迟灯杂货铺：http://localhost:8000")
    print("AI 策略发布接口已启用；按 Ctrl+C 停止。")
    ThreadingHTTPServer(("127.0.0.1", 8000), Handler).serve_forever()
