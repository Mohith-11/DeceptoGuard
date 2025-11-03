"""
Security utilities for DeceptoGuard
Handles input validation and security measures
"""

import re
import html
from urllib.parse import urlparse, quote, unquote

def sanitize_input(user_input):
    """
    Sanitize user input to prevent injection attacks
    
    Args:
        user_input (str): Raw user input
        
    Returns:
        str: Sanitized input
    """
    if not isinstance(user_input, str):
        return str(user_input)
    
    # Remove null bytes
    sanitized = user_input.replace('\x00', '')
    
    # HTML escape
    sanitized = html.escape(sanitized)
    
    # Limit length
    max_length = 2048  # Maximum URL length
    if len(sanitized) > max_length:
        sanitized = sanitized[:max_length]
    
    return sanitized.strip()

def validate_url(url):
    """
    Validate if a URL is safe to process
    
    Args:
        url (str): URL to validate
        
    Returns:
        tuple: (is_valid: bool, error_message: str)
    """
    if not url:
        return False, "URL cannot be empty"
    
    # Check length
    if len(url) > 2048:
        return False, "URL too long (max 2048 characters)"
    
    # Check for malicious patterns
    malicious_patterns = [
        r'javascript:',
        r'data:',
        r'vbscript:',
        r'file:',
        r'<script',
        r'</script>',
        r'<iframe',
        r'</iframe>',
        r'eval\(',
        r'alert\(',
    ]
    
    url_lower = url.lower()
    for pattern in malicious_patterns:
        if re.search(pattern, url_lower):
            return False, f"URL contains potentially malicious content: {pattern}"
    
    # Basic URL format validation
    try:
        parsed = urlparse(url)
        if not parsed.scheme or not parsed.netloc:
            return False, "Invalid URL format"
        
        if parsed.scheme not in ['http', 'https']:
            return False, "Only HTTP and HTTPS URLs are supported"
        
    except Exception as e:
        return False, f"URL parsing error: {str(e)}"
    
    return True, ""

def is_safe_domain(domain):
    """
    Check if a domain is considered safe
    
    Args:
        domain (str): Domain to check
        
    Returns:
        bool: True if safe, False otherwise
    """
    if not domain:
        return False
    
    # Whitelist of known safe domains
    safe_domains = {
        'google.com', 'gmail.com', 'youtube.com',
        'facebook.com', 'instagram.com', 'whatsapp.com',
        'amazon.com', 'aws.amazon.com',
        'microsoft.com', 'office.com', 'outlook.com',
        'apple.com', 'icloud.com',
        'github.com', 'stackoverflow.com',
        'wikipedia.org', 'wikimedia.org',
        'linkedin.com', 'twitter.com',
        'paypal.com', 'ebay.com',
        'netflix.com', 'spotify.com'
    }
    
    # Check if domain or its parent domain is in safe list
    domain_parts = domain.lower().split('.')
    for i in range(len(domain_parts)):
        test_domain = '.'.join(domain_parts[i:])
        if test_domain in safe_domains:
            return True
    
    return False

def detect_suspicious_patterns(url):
    """
    Detect suspicious patterns in URLs
    
    Args:
        url (str): URL to analyze
        
    Returns:
        list: List of suspicious patterns found
    """
    suspicious = []
    
    # Check for IP addresses
    ip_pattern = r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}'
    if re.search(ip_pattern, url):
        suspicious.append("IP address instead of domain")
    
    # Check for excessive subdomains
    parsed = urlparse(url)
    if parsed.netloc.count('.') > 4:
        suspicious.append("Excessive subdomains")
    
    # Check for suspicious TLDs
    suspicious_tlds = ['.tk', '.ml', '.cf', '.ga', '.ph', '.cc']
    for tld in suspicious_tlds:
        if url.endswith(tld):
            suspicious.append(f"Suspicious TLD: {tld}")
    
    # Check for URL shorteners
    shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd']
    for shortener in shorteners:
        if shortener in parsed.netloc:
            suspicious.append(f"URL shortener: {shortener}")
    
    # Check for homograph attacks (mixed scripts)
    if any(ord(c) > 127 for c in url):
        suspicious.append("Contains non-ASCII characters (possible homograph attack)")
    
    # Check for excessive length
    if len(url) > 100:
        suspicious.append("Unusually long URL")
    
    return suspicious

def rate_limit_check(ip_address, max_requests=100, time_window=3600):
    """
    Simple rate limiting check (in production, use Redis or similar)
    
    Args:
        ip_address (str): Client IP address
        max_requests (int): Maximum requests allowed
        time_window (int): Time window in seconds
        
    Returns:
        bool: True if allowed, False if rate limited
    """
    # This is a simplified implementation
    # In production, implement proper rate limiting with Redis
    return True

def validate_api_request(request_data):
    """
    Validate API request data
    
    Args:
        request_data (dict): Request data to validate
        
    Returns:
        tuple: (is_valid: bool, error_message: str, sanitized_data: dict)
    """
    if not isinstance(request_data, dict):
        return False, "Request data must be a JSON object", {}
    
    if 'url' not in request_data:
        return False, "Missing required field: url", {}
    
    url = request_data['url']
    
    # Sanitize URL
    sanitized_url = sanitize_input(url)
    
    # Validate URL
    is_valid, error_msg = validate_url(sanitized_url)
    if not is_valid:
        return False, error_msg, {}
    
    sanitized_data = {
        'url': sanitized_url
    }
    
    return True, "", sanitized_data

def get_client_ip(request):
    """
    Get client IP address from request
    
    Args:
        request: Flask request object
        
    Returns:
        str: Client IP address
    """
    # Check for forwarded headers (when behind proxy)
    if 'X-Forwarded-For' in request.headers:
        ip = request.headers['X-Forwarded-For'].split(',')[0].strip()
    elif 'X-Real-IP' in request.headers:
        ip = request.headers['X-Real-IP']
    else:
        ip = request.remote_addr
    
    return ip or 'unknown'