---
status: accepted
date: 2026-09-17
source: PLAN-001 Q1 사용자 답변
---

# Supabase와 Vercel을 기반 플랫폼으로 사용한다

Next.js 서비스의 인증·데이터베이스·파일 저장은 Supabase, 배포는 Vercel을 사용하기로 사용자가 Q1 권장안을 채택했다. 최대 40일의 개발 기간 안에서 프로젝트 SNS의 게시·권한·운영 흐름에 집중하기 위해 이 기능들을 직접 구축하는 범위를 줄이는 대신, 인증 사용자·Storage·RLS와 배포 환경에 대한 제공자 의존성을 받아들인다.

가입/로그인은 GitHub·Google, 지도는 Kakao Maps이며 위치 입력은 선택이다. 정확한 패키지 버전·요금제·계정 연결 정책·공개 위치 정밀도·실제 환경 생성은 이 결정과 구분한다. [기술 명세](../03_TECH_SPEC.md), [Q1 기록](../plans/PLAN-001-planning-review.md#q1-기반-스택가입-방식)
