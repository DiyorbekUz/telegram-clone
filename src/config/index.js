import dotenv from 'dotenv'
import path from 'path'

process.env.PORT = process.env.PORT || 3000

dotenv.config({ path: path.join(process.cwd(), '.env') })