---
description: Docker Compose 기반 실습 환경을 구축합니다. Kafka, Elasticsearch, MySQL, Redis 등의 기술을 모니터링과 함께 로컬에서 실습할 수 있는 환경을 생성합니다. 사용자가 실습, lab, 환경 구축을 언급하면 이 스킬을 사용합니다.
argument-hint: "kafka" | "es" | "db" | "redis" | "[기술] destroy"
user-invocable: true
---

# Lab - 실습 환경 구축 스킬

인자: $ARGUMENTS

---

## 설계 원칙

1. **기술별 독립**: 카프카 실습할 때 ES를 띄우지 않는다. 각 lab은 독립적으로 기동/종료된다.
2. **학습 내용에 맞게 생성**: 미리 만들어둔 범용 compose가 아니라, 현재 학습 주제에 맞는 구성을 생성한다.
3. **모니터링 포함**: 모든 lab은 해당 기술에 적합한 모니터링을 기본 포함한다.
4. **단계적 확장**: 기본 구성으로 시작하고, 필요하면 부하테스트/APM을 추가한다.

---

## 디렉토리 구조

```
labs/
├── kafka/
│   ├── docker-compose.yml
│   ├── docker-compose.monitoring.yml   (선택)
│   ├── docker-compose.loadtest.yml     (선택)
│   └── apps/
│
├── elasticsearch/
│   ├── docker-compose.yml
│   ├── docker-compose.apm.yml          (선택)
│   └── apps/
│
├── database/
│   ├── docker-compose.yml
│   ├── docker-compose.monitoring.yml   (선택)
│   ├── data/
│   └── queries/
│
├── redis/
│   ├── docker-compose.yml
│   ├── docker-compose.monitoring.yml   (선택)
│   └── apps/
│
└── shared/
    ├── grafana/
    │   └── provisioning/
    ├── prometheus/
    │   └── prometheus.yml
    └── loadtest/
        └── k6/
```

---

## 기술별 구성 가이드

### Kafka Lab

#### 기본 구성 (docker-compose.yml)
```yaml
# 구성 요소:
# - Zookeeper (1대) 또는 KRaft 모드 (Zookeeper 없이)
# - Kafka Broker 3대 (클러스터)
# - Kafka UI (토픽/메시지/컨슈머그룹 확인용)
#
# 포트:
# - 9092, 9093, 9094: Kafka brokers
# - 8080: Kafka UI
#
# 네트워크: kafka-net (bridge)
```

생성 시 확인할 사항:
- **KRaft vs Zookeeper**: Kafka 3.x 이상이면 KRaft 모드 권장 (Zookeeper 불필요)
- **메모리**: broker당 KAFKA_HEAP_OPTS를 512MB~1GB로 제한 (로컬이므로)
- **볼륨**: 데이터 영속성이 필요하면 named volume, 아니면 tmpfs

#### 모니터링 추가 (docker-compose.monitoring.yml)
```yaml
# 추가 구성:
# - JMX Exporter (각 broker에 agent로 연결)
# - Prometheus (메트릭 수집)
# - Grafana (대시보드)
#   - 프리셋 대시보드: Kafka Broker Metrics, Consumer Lag
#
# 기동: docker compose -f docker-compose.yml -f docker-compose.monitoring.yml up -d
```

#### 부하테스트 (docker-compose.loadtest.yml)
```yaml
# 추가 구성:
# - k6 (부하 생성기)
#
# 시나리오 예시:
# - 프로듀서 throughput 측정: 초당 N건 전송, acks=0/1/all 비교
# - 컨슈머 랙 시뮬레이션: 프로듀서 속도 > 컨슈머 속도
```

#### 테스트 앱 (apps/)
- 간단한 Java/Kotlin 프로듀서-컨슈머 앱
- 설정값(acks, batch.size, linger.ms 등)을 외부 환경변수로 주입 가능하게
- 학습 주제에 따라 앱 코드를 조정

---

### Elasticsearch Lab

#### 기본 구성 (docker-compose.yml)
```yaml
# 구성 요소:
# - Elasticsearch 3-node 클러스터 (또는 single node for 간단한 실습)
# - Kibana
#
# 포트:
# - 9200: Elasticsearch
# - 5601: Kibana
#
# 주의:
# - vm.max_map_count=262144 (호스트 설정 필요)
# - ES_JAVA_OPTS: -Xms512m -Xmx512m (로컬 메모리 제한)
# - 노드 수는 실습 목적에 따라 1 또는 3으로 조정
```

생성 시 확인할 사항:
- **싱글 노드 vs 클러스터**: 검색/분석 실습은 1노드, 샤딩/복제 실습은 3노드
- **보안**: 로컬 실습이므로 xpack.security.enabled=false 가능
- **샘플 데이터**: Kibana의 기본 샘플 데이터셋 활용 가능

#### APM 추가 (docker-compose.apm.yml)
```yaml
# 추가 구성:
# - Elastic APM Server
# - APM Agent (테스트 앱에 연결)
#
# 기동: docker compose -f docker-compose.yml -f docker-compose.apm.yml up -d
```

---

### Database Lab (MySQL)

#### 기본 구성 (docker-compose.yml)
```yaml
# 구성 요소:
# - MySQL 8.x (slow_query_log 활성화, long_query_time=0.5)
# - Adminer 또는 phpMyAdmin (웹 기반 SQL 클라이언트)
#
# 포트:
# - 3306: MySQL
# - 8080: Adminer
#
# 초기화:
# - data/ 디렉토리의 .sql 파일이 자동 실행됨
# - 실습용 대량 데이터 생성 스크립트 포함
```

생성 시 확인할 사항:
- **쿼리 튜닝 실습**: slow_query_log, performance_schema 활성화 필수
- **EXPLAIN 분석**: 인덱스 실습을 위한 대량 데이터(100만건+) 생성 스크립트
- **설정 파일**: my.cnf를 볼륨 마운트해서 파라미터 튜닝 실습 가능하게

#### 모니터링 추가 (docker-compose.monitoring.yml)
```yaml
# 추가 구성:
# - MySQL Exporter (Prometheus용)
# - Prometheus
# - Grafana (MySQL Overview 대시보드)
#
# 관찰할 메트릭:
# - QPS, 쿼리 타입별 비율
# - InnoDB Buffer Pool Hit Ratio
# - Connection 수
# - Slow Query 수
```

#### 쿼리 실습 (queries/)
- 학습한 챕터의 쿼리 튜닝 기법을 직접 실습하는 SQL 파일
- EXPLAIN ANALYZE 비교용 Before/After 쿼리

---

### Redis Lab

#### 기본 구성 (docker-compose.yml)
```yaml
# 구성 요소:
# - Redis (단일 또는 Sentinel/Cluster 모드)
# - Redis Insight (GUI 클라이언트)
#
# 포트:
# - 6379: Redis
# - 5540: Redis Insight
#
# 모드 선택:
# - Standalone: 기본 자료구조, 캐싱 실습
# - Sentinel (3대): 고가용성, 페일오버 실습
# - Cluster (6대): 샤딩, 슬롯 분배 실습
```

생성 시 확인할 사항:
- **메모리 정책**: maxmemory + maxmemory-policy 설정
- **영속성**: RDB/AOF 설정 실습 가능하게
- **모드**: 실습 주제에 따라 Standalone/Sentinel/Cluster 선택

#### 모니터링 추가 (docker-compose.monitoring.yml)
```yaml
# 추가 구성:
# - Redis Exporter (Prometheus용)
# - Prometheus + Grafana
#
# 관찰할 메트릭:
# - 메모리 사용량 (used_memory vs maxmemory)
# - Hit Rate (keyspace_hits / keyspace_misses)
# - 커넥션 수
# - Eviction 수
```

---

## 실행 플로우

### Phase 1: lab 환경 결정

1. 사용자가 이 스킬 호출 (또는 `/oh-my-study-with-me:study` 세션 중 실습 요청)
2. 현재 학습 주제를 파악한다.
3. 학습 주제에 맞는 구성을 결정한다:
   - 기본만 필요한가? (compose.yml만)
   - 모니터링이 필요한가? (+monitoring.yml)
   - 부하테스트가 필요한가? (+loadtest.yml)
   - 클러스터가 필요한가? (노드 수 결정)
4. 사용자에게 구성을 확인받는다.

### Phase 2: 환경 구축

1. `labs/[기술]/` 디렉토리를 생성한다.
2. docker-compose.yml 을 생성한다.
   - 학습 주제에 맞는 설정을 포함한다.
   - 주석으로 각 설정의 의미와 학습 포인트를 적는다.
3. 필요한 설정 파일(prometheus.yml, grafana 대시보드 등)을 생성한다.
4. `docker compose up -d`로 기동한다.
5. 각 서비스의 접속 URL을 안내한다.

### Phase 3: 테스트 앱 / 스크립트 생성

1. 학습 주제에 맞는 테스트 코드를 생성한다.
   - 카프카: 프로듀서/컨슈머 Java 앱
   - ES: 인덱싱/검색 스크립트 (curl 또는 Java)
   - DB: SQL 쿼리 파일 + 대량 데이터 생성 스크립트
   - Redis: redis-cli 명령어 스크립트 또는 Java 앱
2. 테스트 코드에도 주석으로 학습 포인트를 적는다.

### Phase 4: 실습 가이드

1. 무엇을 관찰해야 하는지 안내한다.
   - 예: "acks=1로 프로듀서를 실행하고, Kafka UI에서 ISR을 확인해봐"
   - 예: "EXPLAIN ANALYZE로 이 쿼리의 실행 계획을 확인해봐"
2. 실습 결과를 함께 분석한다.
3. 결과가 기대와 다르면, 왜 다른지 First Principles로 파고든다.

### Phase 5: 정리

1. `docker compose down` (데이터 보존) 또는 `docker compose down -v` (완전 정리)
2. 실습 결과와 관찰 내용을 기록한다 (블로그 소재로 활용 가능)

---

## /oh-my-study-with-me:study 연동

study 세션의 Phase 3 (검증) 에서 "직접 해보고 싶다"는 요청이 나오면:
1. 현재 학습 주제에 맞는 lab 구성을 제안한다.
2. 사용자가 동의하면 Phase 2~4를 실행한다.
3. 실습 결과를 검증 통과 여부에 반영한다.

---

## 주의사항

- **리소스 관리**: 로컬 머신의 메모리를 고려해서 서비스별 메모리 제한을 반드시 설정한다.
  - 카프카 3-broker: 총 ~2GB
  - ES 3-node: 총 ~2GB
  - MySQL + 모니터링: ~1GB
- **포트 충돌**: 여러 lab을 동시에 띄울 수 있으므로 포트가 겹치지 않게 관리한다.
- **Docker Desktop 메모리**: 최소 8GB 할당 권장 (여러 lab 동시 사용 시)
- **.env 파일**: lab별 .env 파일에 버전, 포트, 메모리 설정을 변수화한다. 단, .env 파일은 .gitignore에 포함하고 .env.example을 제공한다.
- **호스트 설정**: ES 사용 시 `sudo sysctl -w vm.max_map_count=262144` 필요 (macOS에서는 Docker Desktop 설정에서 처리)
