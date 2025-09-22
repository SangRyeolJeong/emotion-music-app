#!/usr/bin/env python3
"""
Spotify API 연동 테스트 스크립트
"""

import os
import sys
import asyncio
from pathlib import Path

# 현재 스크립트의 디렉토리를 기준으로 app 모듈 경로 추가
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

from app.services.spotify import get_spotify, get_recommendations, get_available_genres
from app.core.config import settings

def test_environment():
    """환경 변수 설정 확인"""
    print("🔧 환경 변수 확인...")
    
    if not settings.SPOTIFY_CLIENT_ID:
        print("❌ SPOTIFY_CLIENT_ID가 설정되지 않았습니다.")
        return False
    
    if not settings.SPOTIFY_CLIENT_SECRET:
        print("❌ SPOTIFY_CLIENT_SECRET이 설정되지 않았습니다.")
        return False
        
    if settings.SPOTIFY_CLIENT_ID == "your_spotify_client_id_here":
        print("❌ SPOTIFY_CLIENT_ID를 실제 값으로 변경해주세요.")
        return False
        
    if settings.SPOTIFY_CLIENT_SECRET == "your_spotify_client_secret_here":
        print("❌ SPOTIFY_CLIENT_SECRET을 실제 값으로 변경해주세요.")
        return False
    
    print(f"✅ SPOTIFY_CLIENT_ID: {settings.SPOTIFY_CLIENT_ID[:8]}...")
    print(f"✅ SPOTIFY_CLIENT_SECRET: {settings.SPOTIFY_CLIENT_SECRET[:8]}...")
    return True

def test_spotify_connection():
    """Spotify API 연결 테스트"""
    print("\n🎵 Spotify 연결 테스트...")
    
    try:
        sp = get_spotify()
        print("✅ Spotify 클라이언트 생성 성공")
        return True
    except Exception as e:
        print(f"❌ Spotify 연결 실패: {e}")
        return False

def test_genres():
    """장르 목록 조회 테스트"""
    print("\n🎸 장르 목록 조회 테스트...")
    
    try:
        genres = get_available_genres()
        print(f"✅ 총 {len(genres)}개 장르 조회 성공")
        print(f"📝 샘플 장르: {', '.join(genres[:10])}")
        return True
    except Exception as e:
        print(f"❌ 장르 조회 실패: {e}")
        return False

def test_recommendations():
    """음악 추천 테스트"""
    print("\n🎤 음악 추천 테스트...")
    
    test_cases = [
        {
            "name": "기쁨 - 팝 음악",
            "params": {
                "seed_genres": ["pop", "dance"],
                "target_valence": 0.8,
                "target_energy": 0.7,
                "limit": 3
            }
        },
        {
            "name": "슬픔 - 인디 음악", 
            "params": {
                "seed_genres": ["indie", "folk"],
                "target_valence": 0.2,
                "target_energy": 0.3,
                "limit": 3
            }
        },
        {
            "name": "분노 - 록 음악",
            "params": {
                "seed_genres": ["rock", "metal"],
                "target_valence": 0.3,
                "target_energy": 0.9,
                "limit": 3
            }
        }
    ]
    
    success_count = 0
    
    for i, test_case in enumerate(test_cases, 1):
        try:
            print(f"\n📱 테스트 {i}: {test_case['name']}")
            result = get_recommendations(**test_case["params"])
            
            print(f"✅ {len(result['tracks'])}개 추천곡 조회 성공")
            
            for j, track in enumerate(result["tracks"], 1):
                artists = ", ".join(track["artists"])
                print(f"   {j}. {track['name']} - {artists}")
                
            success_count += 1
            
        except Exception as e:
            print(f"❌ 테스트 {i} 실패: {e}")
    
    print(f"\n📊 추천 테스트 결과: {success_count}/{len(test_cases)} 성공")
    return success_count == len(test_cases)

def main():
    """메인 테스트 실행"""
    print("🚀 Spotify API 통합 테스트 시작\n")
    
    tests = [
        ("환경 설정", test_environment),
        ("Spotify 연결", test_spotify_connection), 
        ("장르 조회", test_genres),
        ("음악 추천", test_recommendations)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        try:
            if test_func():
                passed += 1
            else:
                print(f"⚠️  {test_name} 테스트에서 문제가 발생했습니다.")
        except Exception as e:
            print(f"❌ {test_name} 테스트 중 예외 발생: {e}")
    
    print(f"\n🏁 테스트 완료: {passed}/{total} 통과")
    
    if passed == total:
        print("🎉 모든 테스트가 성공했습니다! Spotify API 연동이 완료되었습니다.")
        print("\n다음 단계:")
        print("1. 백엔드 서버 실행: uvicorn app.main:app --reload")
        print("2. API 문서 확인: http://localhost:8000/docs")
        print("3. 추천 API 테스트: http://localhost:8000/v1/recommend/test")
    else:
        print("⚠️  일부 테스트가 실패했습니다. SPOTIFY_SETUP.md를 참조하여 설정을 확인해주세요.")
        
        if not test_environment():
            print("\n🔧 .env 파일 설정 가이드:")
            print("1. backend/.env 파일 생성")
            print("2. Spotify Developer Dashboard에서 Client ID/Secret 복사")
            print("3. .env 파일에 실제 값으로 설정")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
