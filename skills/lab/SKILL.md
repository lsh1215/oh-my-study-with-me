---
description: Sets up a Docker Compose-based lab environment. Creates a local environment for hands-on practice with technologies like Kafka, Elasticsearch, MySQL, and Redis, including monitoring. Use this skill when the user mentions practice, lab, or environment setup.
argument-hint: "kafka" | "es" | "db" | "redis" | "[technology] destroy"
user-invocable: true
---

# Lab - Lab Environment Setup Skill

Arguments: $ARGUMENTS

---

## Design Principles

1. **Technology isolation**: When practicing Kafka, do not spin up ES. Each lab starts and stops independently.
2. **Generated to match learning content**: Instead of a pre-built generic compose, generate a configuration that matches the current learning topic.
3. **Monitoring included**: Every lab includes monitoring appropriate for that technology by default.
4. **Incremental expansion**: Start with a basic configuration and add load testing/APM as needed.

---

## Directory Structure

```
labs/
├── kafka/
│   ├── docker-compose.yml
│   ├── docker-compose.monitoring.yml   (optional)
│   ├── docker-compose.loadtest.yml     (optional)
│   └── apps/
│
├── elasticsearch/
│   ├── docker-compose.yml
│   ├── docker-compose.apm.yml          (optional)
│   └── apps/
│
├── database/
│   ├── docker-compose.yml
│   ├── docker-compose.monitoring.yml   (optional)
│   ├── data/
│   └── queries/
│
├── redis/
│   ├── docker-compose.yml
│   ├── docker-compose.monitoring.yml   (optional)
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

## Technology-Specific Configuration Guide

### Kafka Lab

#### Basic Configuration (docker-compose.yml)
```yaml
# Components:
# - Zookeeper (1 node) or KRaft mode (without Zookeeper)
# - Kafka Broker x3 (cluster)
# - Kafka UI (for viewing topics/messages/consumer groups)
#
# Ports:
# - 9092, 9093, 9094: Kafka brokers
# - 8080: Kafka UI
#
# Network: kafka-net (bridge)
```

Things to verify when generating:
- **KRaft vs Zookeeper**: KRaft mode is recommended for Kafka 3.x and above (no Zookeeper needed)
- **Memory**: Limit KAFKA_HEAP_OPTS to 512MB~1GB per broker (since it runs locally)
- **Volumes**: Use named volumes for data persistence, or tmpfs if persistence is not needed

#### Adding Monitoring (docker-compose.monitoring.yml)
```yaml
# Additional components:
# - JMX Exporter (attached as agent to each broker)
# - Prometheus (metrics collection)
# - Grafana (dashboards)
#   - Preset dashboards: Kafka Broker Metrics, Consumer Lag
#
# Start: docker compose -f docker-compose.yml -f docker-compose.monitoring.yml up -d
```

#### Load Testing (docker-compose.loadtest.yml)
```yaml
# Additional components:
# - k6 (load generator)
#
# Example scenarios:
# - Producer throughput measurement: send N messages/sec, compare acks=0/1/all
# - Consumer lag simulation: producer speed > consumer speed
```

#### Test Apps (apps/)
- Simple Java/Kotlin producer-consumer app
- Configuration values (acks, batch.size, linger.ms, etc.) injectable via external environment variables
- Adjust app code according to the learning topic

---

### Elasticsearch Lab

#### Basic Configuration (docker-compose.yml)
```yaml
# Components:
# - Elasticsearch 3-node cluster (or single node for simple practice)
# - Kibana
#
# Ports:
# - 9200: Elasticsearch
# - 5601: Kibana
#
# Notes:
# - vm.max_map_count=262144 (requires host configuration)
# - ES_JAVA_OPTS: -Xms512m -Xmx512m (limit local memory usage)
# - Adjust number of nodes to 1 or 3 depending on the practice goal
```

Things to verify when generating:
- **Single node vs cluster**: 1 node for search/analysis practice, 3 nodes for sharding/replication practice
- **Security**: xpack.security.enabled=false is acceptable for local practice
- **Sample data**: Kibana's built-in sample datasets can be used

#### Adding APM (docker-compose.apm.yml)
```yaml
# Additional components:
# - Elastic APM Server
# - APM Agent (connected to test app)
#
# Start: docker compose -f docker-compose.yml -f docker-compose.apm.yml up -d
```

---

### Database Lab (MySQL)

#### Basic Configuration (docker-compose.yml)
```yaml
# Components:
# - MySQL 8.x (slow_query_log enabled, long_query_time=0.5)
# - Adminer or phpMyAdmin (web-based SQL client)
#
# Ports:
# - 3306: MySQL
# - 8080: Adminer
#
# Initialization:
# - .sql files in the data/ directory are executed automatically
# - Includes scripts for generating large datasets for practice
```

Things to verify when generating:
- **Query tuning practice**: slow_query_log and performance_schema must be enabled
- **EXPLAIN analysis**: Data generation scripts for large datasets (1M+ rows) for index practice
- **Config file**: Mount my.cnf as a volume to enable parameter tuning practice

#### Adding Monitoring (docker-compose.monitoring.yml)
```yaml
# Additional components:
# - MySQL Exporter (for Prometheus)
# - Prometheus
# - Grafana (MySQL Overview dashboard)
#
# Metrics to observe:
# - QPS, query type ratio
# - InnoDB Buffer Pool Hit Ratio
# - Connection count
# - Slow Query count
```

#### Query Practice (queries/)
- SQL files for hands-on practice of query tuning techniques from the studied chapter
- Before/After queries for EXPLAIN ANALYZE comparison

---

### Redis Lab

#### Basic Configuration (docker-compose.yml)
```yaml
# Components:
# - Redis (standalone, Sentinel, or Cluster mode)
# - Redis Insight (GUI client)
#
# Ports:
# - 6379: Redis
# - 5540: Redis Insight
#
# Mode selection:
# - Standalone: basic data structures, caching practice
# - Sentinel (3 nodes): high availability, failover practice
# - Cluster (6 nodes): sharding, slot distribution practice
```

Things to verify when generating:
- **Memory policy**: Configure maxmemory + maxmemory-policy
- **Persistence**: Enable RDB/AOF configuration for practice
- **Mode**: Choose Standalone/Sentinel/Cluster based on the practice topic

#### Adding Monitoring (docker-compose.monitoring.yml)
```yaml
# Additional components:
# - Redis Exporter (for Prometheus)
# - Prometheus + Grafana
#
# Metrics to observe:
# - Memory usage (used_memory vs maxmemory)
# - Hit Rate (keyspace_hits / keyspace_misses)
# - Connection count
# - Eviction count
```

---

## Execution Flow

### Phase 1: Determine the lab environment

1. User invokes this skill (or requests a lab during a `/oh-my-study-with-me:study` session)
2. Identify the current learning topic.
3. Determine the configuration that fits the learning topic:
   - Is only the base needed? (compose.yml only)
   - Is monitoring needed? (+monitoring.yml)
   - Is load testing needed? (+loadtest.yml)
   - Is a cluster needed? (decide number of nodes)
4. Confirm the configuration with the user.

### Phase 2: Set up the environment

1. Create the `labs/[technology]/` directory.
2. Create docker-compose.yml.
   - Include settings appropriate for the learning topic.
   - Add comments explaining the meaning of each setting and the learning points.
3. Create any required config files (prometheus.yml, Grafana dashboards, etc.).
4. Start with `docker compose up -d`.
5. Provide the access URLs for each service.

### Phase 3: Create test apps / scripts

1. Generate test code appropriate for the learning topic.
   - Kafka: producer/consumer Java app
   - ES: indexing/search scripts (curl or Java)
   - DB: SQL query files + large dataset generation scripts
   - Redis: redis-cli command scripts or Java app
2. Add comments to the test code as well, noting the learning points.

### Phase 4: Practice guide

1. Explain what to observe.
   - e.g., "Run the producer with acks=1, then check the ISR in Kafka UI"
   - e.g., "Check the execution plan for this query with EXPLAIN ANALYZE"
2. Analyze the practice results together.
3. If the results differ from expectations, dig into why using First Principles.

### Phase 5: Teardown

1. `docker compose down` (preserve data) or `docker compose down -v` (full cleanup)
2. Record the practice results and observations (can be used as blog material)

---

## Integration with /oh-my-study-with-me:study

When a request to "try it hands-on" comes up during Phase 3 (Verification) of a study session:
1. Propose a lab configuration suited to the current learning topic.
2. If the user agrees, execute Phases 2 through 4.
3. Reflect the practice results in whether the verification is passed.

---

## Notes

- **Resource management**: Always set memory limits per service, taking the local machine's memory into account.
  - Kafka 3-broker: ~2GB total
  - ES 3-node: ~2GB total
  - MySQL + monitoring: ~1GB
- **Port conflicts**: Since multiple labs may be running simultaneously, manage ports carefully to avoid collisions.
- **Docker Desktop memory**: Minimum 8GB allocation recommended (when using multiple labs simultaneously)
- **.env files**: Parameterize version, port, and memory settings in a per-lab .env file. However, include .env files in .gitignore and provide a .env.example instead.
- **Host configuration**: When using ES, `sudo sysctl -w vm.max_map_count=262144` is required (on macOS, this is handled in Docker Desktop settings)
