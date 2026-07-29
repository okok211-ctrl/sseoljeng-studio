export default function handler(req,res){
 res.status(200).json({
  openai:Boolean(process.env.OPENAI_API_KEY),
  supabaseUrl:process.env.SUPABASE_URL||'',
  supabaseAnonKey:process.env.SUPABASE_ANON_KEY||''
 })
}