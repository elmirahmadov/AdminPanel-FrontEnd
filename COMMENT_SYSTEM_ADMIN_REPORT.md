# Comment Sistemi - Admin Panel Entegrasyon Raporu

## 🔐 Admin/Moderatör Yetkilendirme

### Role-Based Access Control

- **Admin Role**: Tam yorum yönetimi yetkisi
- **Moderator Role**: Yorum moderasyonu ve onaylama yetkisi
- **JWT Token Gereksinimi**: Tüm admin endpoint'leri için zorunlu

### Güvenlik Katmanları

1. **Authentication**: JWT token validation
2. **Authorization**: Role-based permission checks
3. **Rate Limiting**: API abuse prevention
4. **Input Validation**: XSS ve injection koruması

## 📊 Admin Endpoint'leri

### 1. Tüm Yorumları Listele

```
GET /api/admin/comments
```

**Query Parameters:**

- `page` (number): Sayfa numarası (varsayılan: 1)
- `limit` (number): Sayfa başına yorum sayısı (varsayılan: 20)
- `status` (string): "PENDING", "APPROVED", "REJECTED", "HIDDEN"
- `reported` (boolean): Sadece rapor edilmiş yorumlar
- `animeId` (number): Belirli anime'ye ait yorumlar
- `userId` (number): Belirli kullanıcının yorumları
- `dateFrom` (string): Başlangıç tarihi (ISO format)
- `dateTo` (string): Bitiş tarihi (ISO format)

**Response:**

```json
{
  "success": true,
  "data": {
    "comments": [
      {
        "id": "string",
        "content": "string",
        "userId": "string",
        "userName": "string",
        "animeId": "string",
        "animeTitle": "string",
        "episodeId": "string",
        "episodeTitle": "string",
        "rating": 5,
        "isApproved": true,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

### 2. Yorum Arama

```
GET /api/admin/comments/search
```

**Query Parameters:**

- `q` (string): Arama terimi (zorunlu)
- `page` (number): Sayfa numarası
- `limit` (number): Sayfa başına sonuç
- `status` (string): Yorum durumu
- `animeId` (number): Anime ID'si
- `userId` (number): Kullanıcı ID'si

**Response:**

```json
{
  "success": true,
  "data": {
    "comments": [...],
    "pagination": {...},
    "searchStats": {
      "totalResults": 25,
      "searchTime": "0.15s"
    }
  }
}
```

### 3. Yorum Moderasyonu

```
PATCH /api/admin/comments/{id}/moderate
```

**Body:**

```json
{
  "action": "APPROVE" | "REJECT" | "HIDE",
  "reason": "string",
  "moderatorNote": "string"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "commentId": "string",
    "status": "APPROVED",
    "moderatedAt": "2024-01-01T00:00:00Z",
    "moderatedBy": "string"
  }
}
```

### 4. Yorum Raporları

```
GET /api/admin/comments/reports
```

**Query Parameters:**

- `page` (number): Sayfa numarası
- `limit` (number): Sayfa başına sonuç
- `status` (string): Rapor durumu
- `severity` (string): "LOW", "MEDIUM", "HIGH", "CRITICAL"

**Response:**

```json
{
  "success": true,
  "data": {
    "reports": [
      {
        "id": "string",
        "commentId": "string",
        "reportedBy": "string",
        "reason": "string",
        "severity": "HIGH",
        "status": "PENDING",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {...}
  }
}
```

## 🎨 Admin Panel UI Bileşenleri

### 1. Yorum Yönetim Dashboard'u

- **İstatistik Kartları**:
  - Toplam yorum sayısı
  - Bekleyen moderasyon sayısı
  - Rapor edilmiş yorum sayısı
  - Günlük yorum artış oranı
- **Grafikler**:
  - Yorum aktivite trendi
  - Moderasyon durumu dağılımı
  - Kullanıcı aktivite analizi

### 2. Yorum Listesi Tablosu

- **Sütunlar**:
  - Kullanıcı adı
  - Anime/Episode bilgisi
  - Yorum içeriği (truncated)
  - Rating
  - Durum (badge ile)
  - Tarih
  - Aksiyonlar
- **Özellikler**:
  - Sıralama (tarih, rating, durum)
  - Filtreleme
  - Toplu işlemler
  - Detay görüntüleme

### 3. Yorum Moderasyon Modal'ı

- **İçerik**:
  - Tam yorum metni
  - Kullanıcı bilgileri
  - Anime/Episode bilgileri
  - Moderasyon seçenekleri
  - Not ekleme alanı
- **Aksiyonlar**:
  - Onayla
  - Reddet
  - Gizle
  - Kullanıcıyı uyar

### 4. Rapor Yönetim Paneli

- **Rapor Detayları**:
  - Rapor eden kullanıcı
  - Rapor sebebi
  - Şiddet seviyesi
  - Rapor tarihi
- **İşlem Seçenekleri**:
  - Raporu incele
  - Yorumu moderat et
  - Raporu kapat
  - Kullanıcıyı cezalandır

## 🔧 Admin Fonksiyonları

### 1. Yorumları Filtreleme ve Listeleme

- **Durum Bazlı Filtreleme**:
  - PENDING: Moderasyon bekleyen yorumlar
  - APPROVED: Onaylanmış yorumlar
  - REJECTED: Reddedilmiş yorumlar
  - HIDDEN: Gizlenmiş yorumlar
- **Gelişmiş Filtreler**:
  - Tarih aralığı
  - Anime/Episode bazlı
  - Kullanıcı bazlı
  - Rating bazlı
  - Rapor durumu

### 2. Yorum Arama

- **Arama Kriterleri**:
  - İçerik metni
  - Kullanıcı adı
  - Anime/Episode başlığı
  - Tag'ler
- **Arama Sonuçları**:
  - Highlight edilmiş eşleşmeler
  - İlgilik skoru
  - Filtreleme seçenekleri

### 3. Yorum Moderasyonu

- **Hızlı Moderasyon**:
  - Toplu onaylama
  - Toplu reddetme
  - Otomatik spam tespiti
- **Detaylı Moderasyon**:
  - İçerik analizi
  - Kullanıcı geçmişi
  - Benzer yorum tespiti

### 4. Rapor Yönetimi

- **Rapor Kategorileri**:
  - Spam
  - Uygunsuz içerik
  - Nefret söylemi
  - Telif hakkı ihlali
  - Diğer
- **Rapor İşleme**:
  - Öncelik sıralaması
  - Otomatik işaretleme
  - Moderator atama

## 📊 Admin Dashboard Özellikleri

### 1. İstatistikler

- **Genel Metrikler**:
  - Toplam yorum sayısı
  - Günlük/haftalık/aylık artış
  - Ortalama rating
  - Aktif kullanıcı sayısı
- **Moderasyon Metrikleri**:
  - Bekleyen moderasyon sayısı
  - Ortalama moderasyon süresi
  - Moderasyon oranları
  - Rapor sayıları

### 2. Filtreleme Seçenekleri

- **Durum Filtreleri**:
  - PENDING, APPROVED, REJECTED, HIDDEN
- **Rapor Filtreleri**:
  - Sadece rapor edilmiş yorumlar
  - Rapor şiddet seviyesi
- **İçerik Filtreleri**:
  - Anime bazlı filtreleme
  - Kullanıcı bazlı filtreleme
  - Tarih aralığı
  - İçerik arama

### 3. Toplu İşlemler

- **Toplu Moderasyon**:
  - Çoklu yorum seçimi
  - Toplu onaylama/reddetme
  - Toplu gizleme
- **Toplu Rapor İşleme**:
  - Raporları toplu kapatma
  - Toplu moderasyon atama
  - Otomatik işlem kuralları

## ⚠️ Admin Güvenlik Kontrolleri

### 1. Role Verification

- **Endpoint Level**: Her admin endpoint'inde role kontrolü
- **Component Level**: UI bileşenlerinde yetki kontrolü
- **Action Level**: Her moderasyon aksiyonunda yetki doğrulama

### 2. Token Validation

- **JWT Token**: Her API isteğinde geçerlilik kontrolü
- **Token Refresh**: Otomatik token yenileme
- **Session Management**: Güvenli oturum yönetimi

### 3. Rate Limiting

- **API Rate Limits**: Aşırı kullanım koruması
- **User Rate Limits**: Kullanıcı bazlı sınırlar
- **IP Rate Limits**: IP bazlı koruma

## 🎯 Admin Panel Kullanım Senaryoları

### 1. Günlük Moderasyon

- **Rutin Kontroller**:
  - PENDING durumundaki yorumları kontrol et
  - Uygun olanları APPROVE et
  - Uygunsuz olanları REJECT et
  - Şüpheli olanları HIDE et
- **Öncelik Sıralaması**:
  - Rapor edilmiş yorumlar
  - Yeni eklenen yorumlar
  - Spam şüphesi olanlar

### 2. Rapor Yönetimi

- **Rapor İnceleme**:
  - Rapor edilmiş yorumları incele
  - Rapor sebebini değerlendir
  - Gerekli moderasyon aksiyonunu al
  - Rapor durumunu güncelle
- **Rapor Analizi**:
  - Rapor trendlerini analiz et
  - Spam pattern'lerini tespit et
  - Kullanıcı davranışlarını izle

### 3. Kullanıcı Yönetimi

- **Kullanıcı İnceleme**:
  - Belirli kullanıcının yorumlarını incele
  - Spam yapan kullanıcıları tespit et
  - Gerekli önlemleri al
- **Kullanıcı Aksiyonları**:
  - Uyarı gönderme
  - Geçici yasaklama
  - Kalıcı yasaklama
  - Kullanıcı notları ekleme

## 🚀 Gelecek Geliştirmeler

### 1. Otomatik Moderasyon

- **AI Destekli**:
  - İçerik analizi
  - Spam tespiti
  - Uygunsuz içerik filtreleme
- **Rule-Based**:
  - Özelleştirilebilir kurallar
  - Otomatik aksiyonlar
  - Threshold yönetimi

### 2. Gelişmiş Analitik

- **Performans Metrikleri**:
  - Moderasyon verimliliği
  - Kullanıcı memnuniyeti
  - Sistem performansı
- **Trend Analizi**:
  - İçerik trendleri
  - Kullanıcı davranışları
  - Platform büyümesi

### 3. Entegrasyon

- **Third-Party Services**:
  - Spam koruma servisleri
  - İçerik filtreleme API'leri
  - Analitik platformları
- **Webhook Desteği**:
  - Moderasyon bildirimleri
  - Rapor alarmları
  - Sistem durumu güncellemeleri

---

**Not**: Bu rapor, admin panel geliştiricilerin comment sistemi ile entegrasyon yapması için gerekli tüm bilgileri içermektedir. Admin panelinde yorum yönetimi, moderasyon ve rapor yönetimi için kapsamlı bir sistem sunulmaktadır.
