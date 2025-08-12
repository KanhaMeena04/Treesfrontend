# AWS Deployment Guide for SocialStream Platform

## Prerequisites
- AWS Account with appropriate permissions
- AWS CLI installed and configured
- Node.js 18+ installed locally
- MongoDB Atlas account (recommended) or self-hosted MongoDB

## Architecture Overview
- **Frontend**: React app deployed on AWS S3 + CloudFront
- **Backend**: Node.js API deployed on AWS EC2 or ECS
- **Database**: MongoDB Atlas or AWS DocumentDB
- **File Storage**: AWS S3 for user uploads
- **CDN**: CloudFront for global content delivery

## Step 1: Database Setup

### Option A: MongoDB Atlas (Recommended)
1. Create MongoDB Atlas account at https://cloud.mongodb.com
2. Create a new cluster (M0 free tier for testing)
3. Configure network access (allow AWS IP ranges)
4. Create database user with read/write permissions
5. Get connection string

### Option B: AWS DocumentDB
```bash
# Create DocumentDB cluster
aws docdb create-db-cluster \
  --db-cluster-identifier socialstream-cluster \
  --engine docdb \
  --master-username admin \
  --master-user-password YourSecurePassword123
```

## Step 2: Backend Deployment on EC2

### Launch EC2 Instance
```bash
# Launch Ubuntu 22.04 LTS instance
aws ec2 run-instances \
  --image-id ami-0c02fb55956c7d316 \
  --instance-type t3.micro \
  --key-name your-key-pair \
  --security-group-ids sg-xxxxxxxxx \
  --subnet-id subnet-xxxxxxxxx
```

### Setup EC2 Instance
```bash
# SSH into instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install nginx for reverse proxy
sudo apt install nginx -y
```

### Deploy Backend Code
```bash
# Clone repository
git clone https://github.com/your-repo/socialstream.git
cd socialstream/backend

# Install dependencies
npm install

# Create production environment file
sudo nano .env
```

### Environment Variables (.env)
```env
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/socialstream
JWT_SECRET=your-super-secure-jwt-secret-key
CORS_ORIGIN=https://your-domain.com
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
S3_BUCKET_NAME=socialstream-uploads
```

### Start Backend with PM2
```bash
# Start application
pm2 start server.js --name "socialstream-api"

# Save PM2 configuration
pm2 save
pm2 startup
```

### Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/socialstream
```

```nginx
server {
    listen 80;
    server_name your-api-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/socialstream /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 3: Frontend Deployment on S3 + CloudFront

### Create S3 Bucket
```bash
# Create bucket for frontend
aws s3 mb s3://socialstream-frontend-bucket

# Enable static website hosting
aws s3 website s3://socialstream-frontend-bucket \
  --index-document index.html \
  --error-document index.html
```

### Build and Deploy Frontend
```bash
# Local machine - build frontend
cd frontend
npm install
npm run build

# Upload to S3
aws s3 sync dist/ s3://socialstream-frontend-bucket --delete

# Set public read permissions
aws s3api put-bucket-policy --bucket socialstream-frontend-bucket --policy '{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::socialstream-frontend-bucket/*"
  }]
}'
```

### Create CloudFront Distribution
```bash
# Create distribution configuration
cat > cloudfront-config.json << EOF
{
  "CallerReference": "socialstream-$(date +%s)",
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [{
      "Id": "S3-socialstream-frontend",
      "DomainName": "socialstream-frontend-bucket.s3.amazonaws.com",
      "S3OriginConfig": {
        "OriginAccessIdentity": ""
      }
    }]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-socialstream-frontend",
    "ViewerProtocolPolicy": "redirect-to-https",
    "TrustedSigners": {
      "Enabled": false,
      "Quantity": 0
    },
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {"Forward": "none"}
    },
    "MinTTL": 0
  },
  "Comment": "SocialStream Frontend Distribution",
  "Enabled": true
}
EOF

# Create distribution
aws cloudfront create-distribution --distribution-config file://cloudfront-config.json
```

## Step 4: SSL Certificate Setup

### Request SSL Certificate
```bash
# Request certificate for your domain
aws acm request-certificate \
  --domain-name your-domain.com \
  --domain-name www.your-domain.com \
  --validation-method DNS
```

### Configure SSL for Backend (Let's Encrypt)
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-api-domain.com
```

## Step 5: Environment Configuration

### Frontend Environment Variables
Create `.env.production` in frontend:
```env
VITE_API_URL=https://your-api-domain.com/api
VITE_WS_URL=wss://your-api-domain.com
```

## Step 6: Monitoring and Logging

### CloudWatch Setup
```bash
# Install CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i amazon-cloudwatch-agent.deb
```

### PM2 Monitoring
```bash
# Monitor application
pm2 monit

# View logs
pm2 logs socialstream-api
```

## Step 7: Security Configuration

### Security Group Rules
```bash
# Allow HTTP/HTTPS traffic
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxxx \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxxx \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0
```

### WAF Configuration (Optional)
```bash
# Create WAF web ACL for additional security
aws wafv2 create-web-acl \
  --name socialstream-waf \
  --scope CLOUDFRONT \
  --default-action Allow={} \
  --rules file://waf-rules.json
```

## Step 8: Backup and Recovery

### Database Backup
```bash
# MongoDB Atlas automatic backups are enabled by default
# For manual backup:
mongodump --uri="mongodb+srv://username:password@cluster.mongodb.net/socialstream" --out backup/
```

### S3 Backup
```bash
# Enable versioning on S3 bucket
aws s3api put-bucket-versioning \
  --bucket socialstream-frontend-bucket \
  --versioning-configuration Status=Enabled
```

## Deployment Checklist

- [ ] Database setup and connection tested
- [ ] Backend deployed and running on EC2
- [ ] Frontend built and deployed to S3
- [ ] CloudFront distribution created
- [ ] SSL certificates installed
- [ ] Environment variables configured
- [ ] Security groups configured
- [ ] Monitoring setup
- [ ] Backup strategy implemented
- [ ] Domain DNS configured
- [ ] Load testing completed

## Cost Optimization

1. **Use AWS Free Tier**: t3.micro EC2, S3 free tier, CloudFront free tier
2. **MongoDB Atlas M0**: Free tier for development
3. **Reserved Instances**: For production workloads
4. **S3 Intelligent Tiering**: For cost-effective storage
5. **CloudWatch Alarms**: Monitor costs and usage

## Troubleshooting

### Common Issues
1. **CORS Errors**: Check CORS_ORIGIN in backend .env
2. **Database Connection**: Verify MongoDB connection string
3. **SSL Issues**: Ensure certificates are properly configured
4. **Performance**: Monitor CloudWatch metrics

### Useful Commands
```bash
# Check backend logs
pm2 logs socialstream-api

# Restart backend
pm2 restart socialstream-api

# Check nginx status
sudo systemctl status nginx

# Test SSL certificate
echo | openssl s_client -connect your-domain.com:443 2>/dev/null | openssl x509 -noout -dates
```

## Support

For deployment issues:
1. Check AWS CloudWatch logs
2. Review PM2 application logs
3. Verify environment variables
4. Test API endpoints manually
5. Check database connectivity

This guide provides a production-ready deployment of the SocialStream platform on AWS with proper security, monitoring, and backup strategies.