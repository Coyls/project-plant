from typing import List


class ProtocolGenerator:

    def __init__(self, key: str, value: str):
        self.key = key
        self.value = value

    def create(self) -> str:
        return f"{self.key}:{self.value}"


class ProtocolDecodeur:

    def __init__(self, msg: str) -> None:
        self.msg = msg

    def getKey(self) -> str:
        return self.msg.split(":")[0]

    def getValue(self) -> str:
        return self.msg.split(":")[1]

    def getKeyValue(self) -> List[str]:
        return self.msg.split(":")
