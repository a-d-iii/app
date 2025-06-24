package com.anonymous.vitstudentapp.attendance

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.anonymous.vitstudentapp.R

class AttendanceAdapter(private val items: List<Subject>) : RecyclerView.Adapter<AttendanceAdapter.ViewHolder>() {
    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val subjectName: TextView = view.findViewById(R.id.subject_name)
        val subjectCode: TextView = view.findViewById(R.id.subject_code)
        val attendancePercent: TextView = view.findViewById(R.id.attendance_percent)
        val icon: ImageView = view.findViewById(R.id.status_icon)
        val card: View = view.findViewById(R.id.card_root)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_subject, parent, false)
        return ViewHolder(view)
    }

    override fun getItemCount(): Int = items.size

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val item = items[position]
        holder.subjectName.text = item.name
        holder.subjectCode.text = item.code
        holder.attendancePercent.text = item.attendance.toString()
        holder.card.setBackgroundColor(getBackgroundColor(item.attendance))
        holder.icon.setImageResource(getIcon(item.attendance))
        holder.icon.setColorFilter(holder.itemView.context.getColor(getIconColor(item.attendance)))
    }
}
