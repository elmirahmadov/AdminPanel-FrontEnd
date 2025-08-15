# Episode Creation Troubleshooting Guide

## Problem: "Bölüm yaratamıyorum" (Cannot create episodes)

### Possible Causes and Solutions:

#### 1. API Configuration Issues

- **Problem**: API endpoints are not properly configured
- **Solution**: Check environment variables in your `.env` file:
  ```
  VITE_API_URL=http://localhost:3000
  VITE_BASE_URL_FETCH=http://localhost:5000
  ```

#### 2. Backend Server Issues

- **Problem**: Backend server is not running or not accessible
- **Solution**:
  - Ensure your backend server is running
  - Check if the API endpoints are working
  - Use the "API Test" button in the episode management modal

#### 3. Authentication Issues

- **Problem**: User is not authenticated or token is expired
- **Solution**:
  - Log out and log back in
  - Check if the access token is valid
  - Clear browser cache and localStorage

#### 4. Form Validation Issues

- **Problem**: Required fields are not filled properly
- **Solution**:
  - Ensure episode name and number are provided
  - Check browser console for validation errors

#### 5. Network Issues

- **Problem**: Network connectivity problems
- **Solution**:
  - Check internet connection
  - Try refreshing the page
  - Check browser console for network errors

### Debugging Steps:

1. **Open Browser Console** (F12)
2. **Check for Error Messages** in the console
3. **Use API Test Button** in episode management modal
4. **Check Network Tab** for failed API requests
5. **Verify Environment Variables** are set correctly

### Common Error Messages:

- `"API Bağlantı Testi: Başarısız"` - Backend server is not accessible
- `"Bölüm kaydedilirken hata oluştu"` - API request failed
- `"Sezon seçilmedi!"` - No season is selected for episode creation

### Quick Fixes:

1. **Restart the application**
2. **Clear browser cache**
3. **Check if backend is running**
4. **Verify API endpoints are correct**
5. **Ensure proper authentication**

If the problem persists, check the browser console for detailed error messages and contact support with the error details.
